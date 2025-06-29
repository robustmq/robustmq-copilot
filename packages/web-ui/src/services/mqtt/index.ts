import { MQTTBrokerAdminServiceClient } from '@mbpb/AdminServiceClientPb';
import * as mqttAdminApi from '@mbpb/admin_pb';
import { QueryOption } from '../common';
import { getQueryOptions } from './util';
import { RaftNodeState } from './placement-status';

const service = new MQTTBrokerAdminServiceClient(process.env.PUBLIC_MQTT_SERVER, null, null);

/** Overview API  */
export interface OverviewMetricsDataItem {
  date: number;
  count: number;
}
export interface OverviewMetricsData {
  connectionNum: OverviewMetricsDataItem[];
  topicNum: OverviewMetricsDataItem[];
  subscribeNum: OverviewMetricsDataItem[];
  messageInNum: OverviewMetricsDataItem[];
  messageOutNum: OverviewMetricsDataItem[];
  messageDropNum: OverviewMetricsDataItem[];
}

export interface OverviewMetricsDataParam {
  startTime: number;
  endTime: number;
}
export const getOverviewMetricsData = async (param: OverviewMetricsDataParam): Promise<OverviewMetricsData> => {
  const request = new mqttAdminApi.ClusterOverviewMetricsRequest();
  request.setStartTime(param.startTime);
  request.setEndTime(param.endTime);

  return new Promise((s, j) => {
    service.cluster_overview_metrics(request, {}, (err, response) => {
      if (err) {
        j(err);
        return;
      }
      const originData = response.toObject();
      const data: OverviewMetricsData = {
        connectionNum: JSON.parse(originData.connectionNum),
        topicNum: JSON.parse(originData.topicNum),
        subscribeNum: JSON.parse(originData.subscribeNum),
        messageInNum: JSON.parse(originData.messageInNum),
        messageOutNum: JSON.parse(originData.messageOutNum),
        messageDropNum: JSON.parse(originData.messageDropNum),
      };
      s(data);
    });
  });
};

export interface BrokerNodeRaw {
  clusterName: string;
  clusterType: string;
  extendInfo: string;
  nodeId: number | bigint;
  nodeIp: string;
  nodeInnerAddr: string;
  startTime: number | bigint;
  registerTime: number | bigint;
}
export interface OverviewStatusData {
  clusterName: string;
  messageInRate: number;
  messageOutRate: number;
  connectionNum: number;
  sessionNum: number;
  topicNum: number;
  nodesList: BrokerNodeRaw[];
  placementStatus?: RaftNodeState;
  tcpConnectionNum: number;
  tlsConnectionNum: number;
  websocketConnectionNum: number;
  quicConnectionNum: number;
  subscribeNum: number;
  exclusiveSubscribeNum: number;
  shareSubscribeLeaderNum: number;
  shareSubscribeResubNum: number;
  exclusiveSubscribeThreadNum: number;
  shareSubscribeLeaderThreadNum: number;
  shareSubscribeFollowerThreadNum: number;
}

export const getOverviewStatusData = async (): Promise<OverviewStatusData> => {
  return new Promise((s, j) => {
    service.cluster_status(new mqttAdminApi.ClusterStatusRequest(), {}, (err, response) => {
      if (err) {
        j(err);
        return;
      }
      const originData = response.toObject();
      const placementStatus = originData.placementStatus ? JSON.parse(originData.placementStatus) : undefined;
      const data: OverviewStatusData = {
        clusterName: originData.clusterName,
        messageInRate: originData.messageInRate,
        messageOutRate: originData.messageOutRate,
        connectionNum: originData.connectionNum,
        sessionNum: originData.sessionNum,
        topicNum: originData.topicNum,
        nodesList: originData.nodesList,
        placementStatus,
        tcpConnectionNum: originData.tcpConnectionNum,
        tlsConnectionNum: originData.tlsConnectionNum,
        websocketConnectionNum: originData.websocketConnectionNum,
        quicConnectionNum: originData.quicConnectionNum,
        subscribeNum: originData.subscribeNum,
        exclusiveSubscribeNum: originData.exclusiveSubscribeNum,
        shareSubscribeLeaderNum: originData.shareSubscribeLeaderNum,
        shareSubscribeResubNum: originData.shareSubscribeResubNum,
        exclusiveSubscribeThreadNum: originData.exclusiveSubscribeThreadNum,
        shareSubscribeLeaderThreadNum: originData.shareSubscribeLeaderThreadNum,
        shareSubscribeFollowerThreadNum: originData.shareSubscribeFollowerThreadNum,
      };
      s(data);
    });
  });
};

/** General APIs */

export const getSessionList = async (query?: QueryOption): Promise<mqttAdminApi.ListSessionReply.AsObject> => {
  return new Promise((s, j) => {
    const request = new mqttAdminApi.ListSessionRequest();
    request.setOptions(getQueryOptions(query));

    service.mqtt_broker_list_session(request, {}, (err, response) => {
      if (err) {
        j(err);
        return;
      }
      s(response.toObject());
    });
  });
};

export const getClientList = async (query?: QueryOption): Promise<mqttAdminApi.ListClientReply.AsObject> => {
  return new Promise((s, j) => {
    const request = new mqttAdminApi.ListClientRequest();
    request.setOptions(getQueryOptions(query));

    service.mqtt_broker_list_client(request, {}, (err, response) => {
      if (err) {
        j(err);
        return;
      }
      s(response.toObject());
    });
  });
};
