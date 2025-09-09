import { requestApi } from '@/utils/requestApi';
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
  start_time: number;
  end_time: number;
}

export const getOverviewMetricsData = async (param: OverviewMetricsDataParam): Promise<OverviewMetricsData> => {
  const response = await requestApi('/mqtt/overview/metrics', param);

  const data: OverviewMetricsData = {
    connectionNum: JSON.parse(response.connection_num),
    topicNum: JSON.parse(response.topic_num),
    subscribeNum: JSON.parse(response.subscribe_num),
    messageInNum: JSON.parse(response.message_in_num),
    messageOutNum: JSON.parse(response.message_out_num),
    messageDropNum: JSON.parse(response.message_drop_num),
  };

  return data;
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
  const response = await requestApi('/mqtt/overview');
  const data: OverviewStatusData = {
    clusterName: response.cluster_name,
    messageInRate: response.message_in_rate,
    messageOutRate: response.message_out_rate,
    connectionNum: response.connection_num,
    sessionNum: response.session_num,
    topicNum: response.topic_num,
    nodesList: response.nodes,
    placementStatus: response.placement_status ? JSON.parse(response.placement_status) : undefined,
    tcpConnectionNum: response.tcp_connection_num,
    tlsConnectionNum: response.tls_connection_num,
    websocketConnectionNum: response.websocket_connection_num,
    quicConnectionNum: response.quic_connection_num,
    subscribeNum: response.subscribe_num,
    exclusiveSubscribeNum: response.exclusive_subscribe_num,
    shareSubscribeLeaderNum: response.share_subscribe_leader_num,
    shareSubscribeResubNum: response.share_subscribe_resub_num,
    exclusiveSubscribeThreadNum: response.exclusive_subscribe_thread_num,
    shareSubscribeLeaderThreadNum: response.share_subscribe_leader_thread_num,
    shareSubscribeFollowerThreadNum: response.share_subscribe_follower_thread_num,
  };

  return data;
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

// -------- User APIs --------
export interface UserRaw {
  username: string;
  isSuperuser: boolean;
}

export const getUserList = async (
  query?: QueryOption,
): Promise<{
  usersList: UserRaw[];
  totalCount: number;
}> => {
  const response = await requestApi('/mqtt/user/list', query);
  return {
    usersList: response.data,
    totalCount: response.total_count,
  };
};
