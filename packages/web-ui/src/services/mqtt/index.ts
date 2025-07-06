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
  startTime: string;
  registerTime: string;
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

export const getTopicList = async (query?: QueryOption): Promise<mqttAdminApi.ListTopicReply.AsObject> => {
  return new Promise((s, j) => {
    const request = new mqttAdminApi.ListTopicRequest();
    request.setOptions(getQueryOptions(query));

    service.mqtt_broker_list_topic(request, {}, (err, response) => {
      if (err) {
        j(err);
        return;
      }
      s(response.toObject());
    });
  });
};

export const getSubscribeList = async (query?: QueryOption): Promise<mqttAdminApi.ListSubscribeReply.AsObject> => {
  return new Promise((s, j) => {
    const request = new mqttAdminApi.ListSubscribeRequest();
    request.setOptions(getQueryOptions(query));

    service.mqtt_broker_list_subscribe(request, {}, (err, response) => {
      if (err) {
        j(err);
        return;
      }
      s(response.toObject());
    });
  });
};

// -------- ACL APIs --------
export const getUserList = async (query?: QueryOption): Promise<mqttAdminApi.ListUserReply.AsObject> => {
  return new Promise((s, j) => {
    const request = new mqttAdminApi.ListUserRequest();
    request.setOptions(getQueryOptions(query));

    service.mqtt_broker_list_user(request, {}, (err, response) => {
      if (err) {
        j(err);
        return;
      }
      s(response.toObject());
    });
  });
};

export const getAclList = async (query?: QueryOption): Promise<mqttAdminApi.ListAclReply.AsObject> => {
  return new Promise((s, j) => {
    const request = new mqttAdminApi.ListAclRequest();
    request.setOptions(getQueryOptions(query));

    service.mqtt_broker_list_acl(request, {}, (err, response) => {
      if (err) {
        j(err);
        return;
      }
      s(response.toObject());
    });
  });
};

export const getBlacklistList = async (query?: QueryOption): Promise<mqttAdminApi.ListBlacklistReply.AsObject> => {
  return new Promise((s, j) => {
    const request = new mqttAdminApi.ListBlacklistRequest();
    request.setOptions(getQueryOptions(query));

    service.mqtt_broker_list_blacklist(request, {}, (err, response) => {
      if (err) {
        j(err);
        return;
      }
      s(response.toObject());
    });
  });
};

// -------- Data Integration APIs --------
export const getConnectorList = async (query?: QueryOption): Promise<mqttAdminApi.MqttListConnectorReply.AsObject> => {
  return new Promise((s, j) => {
    const request = new mqttAdminApi.MqttListConnectorRequest();

    service.mqtt_broker_list_connector(request, {}, (err, response) => {
      if (err) {
        j(err);
        return;
      }
      s(response.toObject());
    });
  });
};

export const getSchemaList = async (query?: QueryOption): Promise<mqttAdminApi.MqttListSchemaReply.AsObject> => {
  return new Promise((s, j) => {
    const request = new mqttAdminApi.MqttListSchemaRequest();

    service.mqtt_broker_list_schema(request, {}, (err, response) => {
      if (err) {
        j(err);
        return;
      }
      s(response.toObject());
    });
  });
};

// -------- Advanced APIs --------
export const getAutoSubscribeRuleList = async (
  query?: QueryOption,
): Promise<mqttAdminApi.ListAutoSubscribeRuleReply.AsObject> => {
  return new Promise((s, j) => {
    const request = new mqttAdminApi.ListAutoSubscribeRuleRequest();

    service.mqtt_broker_list_auto_subscribe_rule(request, {}, (err, response) => {
      if (err) {
        j(err);
        return;
      }
      s(response.toObject());
    });
  });
};

export const getSlowSubscribeList = async (
  query?: QueryOption,
): Promise<mqttAdminApi.ListSlowSubscribeReply.AsObject> => {
  return new Promise((s, j) => {
    const request = new mqttAdminApi.ListSlowSubscribeRequest();

    service.mqtt_broker_list_slow_subscribe(request, {}, (err, response) => {
      if (err) {
        j(err);
        return;
      }
      s(response.toObject());
    });
  });
};

export const getTopicRewriteRuleList = async (
  query?: QueryOption,
): Promise<mqttAdminApi.ListRewriteTopicRuleReply.AsObject> => {
  return new Promise((s, j) => {
    const request = new mqttAdminApi.ListRewriteTopicRuleRequest();

    service.mqtt_broker_get_all_topic_rewrite_rule(request, {}, (err, response) => {
      if (err) {
        j(err);
        return;
      }
      s(response.toObject());
    });
  });
};
