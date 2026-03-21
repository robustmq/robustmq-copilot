import { requestApi } from '@/utils/requestApi';
import { QueryOption } from '../common';
import { RaftNodeState } from './placement-status';

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

export interface MonitorDataRequest {
  data_type: string;
  topic_name?: string;
  client_id?: string;
  path?: string;
  connector_name?: string;
}

// 获取单个监控数据类型的数据
export const getMonitorData = async (
  data_type: string,
  topic_name?: string,
  client_id?: string,
  path?: string,
  connector_name?: string,
): Promise<OverviewMetricsDataItem[]> => {
  const request: MonitorDataRequest = { data_type };
  if (topic_name) {
    request.topic_name = topic_name;
  }
  if (client_id) {
    request.client_id = client_id;
  }
  if (path) {
    request.path = path;
  }
  if (connector_name) {
    request.connector_name = connector_name;
  }

  const response = await requestApi('/api/mqtt/monitor/data', request, 'GET');

  // 转换 API 返回的数据格式：{date, value} → {date, count}
  try {
    if (!Array.isArray(response)) {
      console.warn('Invalid data format, expected array:', response);
      return [];
    }
    return response
      .map((item: { date: number; value: number }) => ({
        date: item.date * 1000, // 转换为毫秒时间戳
        count: item.value,
      }))
      .sort((a, b) => a.date - b.date); // 根据 date 进行升序排列
  } catch (error) {
    console.warn('Failed to transform monitor data:', error);
    return [];
  }
};

// 获取所有监控数据（并行请求）
export const getOverviewMetricsData = async (): Promise<OverviewMetricsData> => {
  try {
    const [connectionNum, topicNum, subscribeNum, messageInNum, messageOutNum, messageDropNum] = await Promise.all([
      getMonitorData('connection_num'),
      getMonitorData('topic_num'),
      getMonitorData('subscribe_num'),
      getMonitorData('message_in_num'),
      getMonitorData('message_out_num'),
      getMonitorData('message_drop_num'),
    ]);

    return {
      connectionNum,
      topicNum,
      subscribeNum,
      messageInNum,
      messageOutNum,
      messageDropNum,
    };
  } catch (error) {
    console.error('Failed to fetch overview metrics data:', error);
    return {
      connectionNum: [],
      topicNum: [],
      subscribeNum: [],
      messageInNum: [],
      messageOutNum: [],
      messageDropNum: [],
    };
  }
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
  connectorNum: number;
  connectorThreadNum: number;
  shareGroupNum: number;
  shareSubNum: number;
  shareSubThreadNum: number;
}

export const getOverviewStatusData = async (): Promise<OverviewStatusData> => {
  const response = await requestApi('/api/mqtt/overview', undefined, 'GET');
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
    connectorNum: response.connector_num || 0,
    connectorThreadNum: response.connector_thread_num || 0,
    shareGroupNum: response.share_group_num || 0,
    shareSubNum: response.share_sub_num || 0,
    shareSubThreadNum: response.share_sub_thread_num || 0,
  };

  return data;
};

// -------- Client APIs --------
export interface ClientRaw {
  client_id: string;
  connection_id: number;
  network_connection: {
    connection_type: string;
    protocol: string;
    addr: string;
    [key: string]: any;
  };
  mqtt_connection: {
    tenant: string;
    source_ip_addr: string;
    login_user: string;
    create_time: string;
    [key: string]: any;
  };
  session?: {
    [key: string]: any;
  };
  heartbeat?: {
    heartbeat: number;
    keep_live: number;
    [key: string]: any;
  };
}

// 将前端的 offset/limit 分页参数转换为 HTTP API 的 page/limit 格式
const convertPaginationForHttpApi = (query?: QueryOption) => {
  if (!query) {
    return query;
  }

  const { pagination, sort, ...rest } = query;
  const result: any = { ...rest };

  // 转换分页参数
  if (pagination) {
    const page = Math.floor(pagination.offset / pagination.limit) + 1; // 计算页码，从1开始
    result.limit = pagination.limit;
    result.page = page;
  }

  // 转换排序参数
  if (sort) {
    result.sort_field = sort.orderBy;
    result.sort_by = sort.direction === 0 ? 'asc' : 'desc'; // 0=asc, 1=desc
  }

  return result;
};

export const getClientListHttp = async (
  query?: QueryOption & { tenant?: string; client_id?: string },
): Promise<{
  clientsList: ClientRaw[];
  totalCount: number;
}> => {
  const { tenant, client_id, ...rest } = query || {};
  const httpQuery = {
    ...convertPaginationForHttpApi(rest),
    ...(tenant ? { tenant } : {}),
    ...(client_id ? { client_id } : {}),
  };
  const response = await requestApi('/api/mqtt/client/list', httpQuery, 'GET');
  return {
    clientsList: response.data,
    totalCount: response.total_count,
  };
};

// -------- Session APIs --------
export interface SessionRaw {
  tenant: string;
  client_id: string;
  session_expiry: number;
  is_contain_last_will: boolean;
  last_will_delay_interval: number;
  create_time: number;
  connection_id: number;
  broker_id: number;
  reconnect_time: number;
  distinct_time: number;
}

export const getSessionListHttp = async (
  query?: QueryOption & { tenant?: string; client_id?: string },
): Promise<{
  sessionsList: SessionRaw[];
  totalCount: number;
}> => {
  const { tenant, client_id, ...rest } = query || {};
  const httpQuery = {
    ...convertPaginationForHttpApi(rest),
    ...(tenant ? { tenant } : {}),
    ...(client_id ? { client_id } : {}),
  };
  const response = await requestApi('/api/mqtt/session/list', httpQuery, 'GET');
  return {
    sessionsList: response.data,
    totalCount: response.total_count,
  };
};

// -------- Topic APIs --------
export interface TopicRaw {
  topic_id: string;
  topic_name: string;
  tenant: string;
  storage_type: string;
  partition: number;
  replication: number;
  storage_name_list: string[];
  create_time: number;
}

export const getTopicListHttp = async (
  query?: QueryOption & { tenant?: string; topic_name?: string; topic_type?: string },
): Promise<{
  topicsList: TopicRaw[];
  totalCount: number;
}> => {
  const { tenant, topic_name, topic_type, ...rest } = (query || {}) as any;
  const httpQuery = convertPaginationForHttpApi(rest);
  const response = await requestApi(
    '/api/mqtt/topic/list',
    {
      ...httpQuery,
      ...(tenant ? { tenant } : {}),
      ...(topic_name ? { topic_name } : {}),
      ...(topic_type ? { topic_type } : {}),
    },
    'GET',
  );
  return {
    topicsList: response.data,
    totalCount: response.total_count,
  };
};

export interface TopicSubscription {
  client_id: string;
  path: string;
}

export interface TopicStorageShard {
  shard_uid: string;
  shard_name: string;
  start_segment_seq: number;
  active_segment_seq: number;
  last_segment_seq: number;
  status: string;
  config: {
    replica_num: number;
    storage_type: string;
    max_segment_size: number;
    retention_sec: number;
  };
  create_time: number;
}

export interface TopicDetail {
  topic_info: {
    topic_id: string;
    topic_name: string;
    storage_type: string;
    partition: number;
    replication: number;
    storage_name_list: Record<string, string>;
    create_time: number;
  };
  retain_message: any | null;
  retain_message_at: number | null;
  sub_list: TopicSubscription[];
  storage_list: Record<string, TopicStorageShard> | null;
}

export const getTopicDetail = async (topicName: string, tenant?: string): Promise<TopicDetail> => {
  const response = await requestApi(
    '/api/mqtt/topic/detail',
    { topic_name: topicName, ...(tenant ? { tenant } : {}) },
    'GET',
  );
  return {
    topic_info: response.topic_info,
    retain_message: response.retain_message,
    retain_message_at: response.retain_message_at,
    sub_list: response.sub_list || [],
    storage_list: response.storage_list || null,
  };
};

export interface DeleteTopicRequest {
  topic_name: string;
  tenant?: string;
}

export const deleteTopic = async (data: DeleteTopicRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/topic/delete', data);
  return response;
};

// -------- Subscribe APIs --------
export interface SubscribeRaw {
  tenant: string;
  client_id: string;
  path: string;
  broker_id: number;
  protocol: string;
  qos: string;
  no_local: number;
  preserve_retain: number;
  retain_handling: string;
  create_time: string;
  pk_id: number;
  properties: string;
  is_share_sub: boolean;
}

export const getSubscribeListHttp = async (
  query?: QueryOption & { tenant?: string; client_id?: string },
): Promise<{
  subscriptionsList: SubscribeRaw[];
  totalCount: number;
}> => {
  const { tenant, client_id, ...rest } = (query || {}) as any;
  const httpQuery = convertPaginationForHttpApi(rest);
  const response = await requestApi(
    '/api/mqtt/subscribe/list',
    {
      ...httpQuery,
      ...(tenant ? { tenant } : {}),
      ...(client_id ? { client_id } : {}),
    },
    'GET',
  );
  return {
    subscriptionsList: response.data,
    totalCount: response.total_count,
  };
};

// 订阅详情相关类型定义
export interface PushSubscribeItem {
  client_id: string;
  sub_path: string;
  rewrite_sub_path: string | null;
  topic_name: string;
  group_name: string | null;
  protocol: string;
  qos: string;
  no_local: boolean;
  preserve_retain: boolean;
  retain_forward_rule: string;
  subscription_identifier: number | null;
  create_time: number; // 秒级时间戳
}

export interface PushThreadItem {
  push_success_record_num: number;
  push_error_record_num: number;
  last_push_time: number; // 秒级时间戳
  last_run_time: number; // 秒级时间戳
  create_time: number; // 秒级时间戳
  bucket_id: string;
}

export interface SubData {
  client_id: string;
  path: string;
  push_subscribe: Record<string, PushSubscribeItem>;
  push_thread: Record<string, PushThreadItem>;
  leader_id: string | null;
}

export interface GroupLeaderInfo {
  broker_id: number;
  broker_addr: string;
  extend_info: string;
}

export interface SubscribeDetail {
  share_sub: boolean;
  group_leader_info: GroupLeaderInfo | null;
  sub_data: SubData;
}

export interface GetSubscribeDetailRequest {
  tenant: string;
  client_id: string;
  path: string;
}

export const getSubscribeDetail = async (data: GetSubscribeDetailRequest): Promise<SubscribeDetail> => {
  const response = await requestApi('/api/mqtt/subscribe/detail', data, 'GET');
  return {
    share_sub: response.share_sub,
    group_leader_info: response.group_leader_info,
    sub_data: response.sub_data,
  };
};

// -------- User APIs --------
export interface UserRaw {
  tenant: string;
  username: string;
  is_superuser: boolean;
  create_time?: number; // Unix timestamp in seconds
}

export const getUserList = async (
  query?: QueryOption & { tenant?: string; user_name?: string },
): Promise<{
  usersList: UserRaw[];
  totalCount: number;
}> => {
  const { tenant, user_name, ...rest } = query || {};
  const httpQuery = {
    ...convertPaginationForHttpApi(rest),
    ...(tenant ? { tenant } : {}),
    ...(user_name ? { user_name } : {}),
  };
  const response = await requestApi('/api/mqtt/user/list', httpQuery, 'GET');
  return {
    usersList: response.data,
    totalCount: response.total_count,
  };
};

export interface CreateUserRequest {
  tenant: string;
  username: string;
  password: string;
  is_superuser: boolean;
}

export const createUser = async (data: CreateUserRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/user/create', data);
  return response;
};

export interface DeleteUserRequest {
  tenant: string;
  username: string;
}

export const deleteUser = async (data: DeleteUserRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/user/delete', data);
  return response;
};

// -------- ACL APIs --------
export interface AclRaw {
  tenant: string;
  name: string;
  desc: string;
  resource_type: string;
  resource_name: string;
  topic: string;
  ip: string;
  action: string;
  permission: string;
}

export const getAclListHttp = async (
  query?: QueryOption & { tenant?: string; name?: string },
): Promise<{
  aclsList: AclRaw[];
  totalCount: number;
}> => {
  const { tenant, name, ...rest } = (query || {}) as any;
  const httpQuery = convertPaginationForHttpApi(rest);
  const response = await requestApi(
    '/api/mqtt/acl/list',
    {
      ...httpQuery,
      ...(tenant ? { tenant } : {}),
      ...(name ? { name } : {}),
    },
    'GET',
  );
  return {
    aclsList: response.data,
    totalCount: response.total_count,
  };
};

export interface CreateAclRequest {
  tenant: string;
  name: string;
  desc?: string;
  resource_type: string;
  resource_name: string;
  topic?: string;
  ip?: string;
  action: string;
  permission: string;
}

export const createAcl = async (data: CreateAclRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/acl/create', data);
  return response;
};

export interface DeleteAclRequest {
  tenant: string;
  name: string;
}

export const deleteAcl = async (data: DeleteAclRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/acl/delete', data);
  return response;
};

// -------- Blacklist APIs --------
export interface BlacklistRaw {
  name: string;
  tenant: string;
  blacklist_type: string;
  resource_name: string;
  end_time: string;
  desc: string;
}

export const getBlacklistListHttp = async (
  query?: QueryOption & { tenant?: string; name?: string },
): Promise<{
  blacklistsList: BlacklistRaw[];
  totalCount: number;
}> => {
  const { tenant, name, ...rest } = (query || {}) as any;
  const httpQuery = convertPaginationForHttpApi(rest);
  const response = await requestApi(
    '/api/mqtt/blacklist/list',
    {
      ...httpQuery,
      ...(tenant ? { tenant } : {}),
      ...(name ? { name } : {}),
    },
    'GET',
  );
  return {
    blacklistsList: response.data,
    totalCount: response.total_count,
  };
};

export interface CreateBlacklistRequest {
  name: string;
  tenant: string;
  blacklist_type: string;
  resource_name: string;
  end_time: number;
  desc?: string;
}

export const createBlacklist = async (data: CreateBlacklistRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/blacklist/create', data);
  return response;
};

export interface DeleteBlacklistRequest {
  tenant: string;
  name: string;
}

export const deleteBlacklist = async (data: DeleteBlacklistRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/blacklist/delete', data);
  return response;
};

// -------- Connector APIs --------
export interface ConnectorRaw {
  tenant: string;
  connector_name: string;
  connector_type: string;
  config: string;
  topic_id: string;
  topic_name: string;
  status: string;
  broker_id: string;
  create_time: string;
  update_time: string;
}

export const getConnectorListHttp = async (
  query?: QueryOption,
  tenant?: string,
  connector_name?: string,
): Promise<{
  connectorsList: ConnectorRaw[];
  totalCount: number;
}> => {
  const { pagination, ...rest } = query || {};
  const httpQuery = convertPaginationForHttpApi({ pagination, ...rest });
  if (tenant) httpQuery.tenant = tenant;
  if (connector_name) httpQuery.connector_name = connector_name;
  const response = await requestApi('/api/mqtt/connector/list', httpQuery, 'GET');
  return {
    connectorsList: response.data,
    totalCount: response.total_count,
  };
};

export interface FailureStrategy {
  strategy: 'discard' | 'discard_after_retry' | 'dead_message_queue';
  retry_total_times?: number;
  wait_time_ms?: number;
  topic_name?: string;
}

export interface CreateConnectorRequest {
  tenant: string;
  connector_name: string;
  connector_type: string;
  config: string; // JSON string
  topic_name: string;
  failure_strategy: FailureStrategy;
}

export const createConnector = async (data: CreateConnectorRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/connector/create', data);
  return response;
};

export interface DeleteConnectorRequest {
  tenant: string;
  connector_name: string;
}

export const deleteConnector = async (data: DeleteConnectorRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/connector/delete', data);
  return response;
};

export interface ConnectorDetailRequest {
  tenant: string;
  connector_name: string;
}

export interface ConnectorDetailResponse {
  last_send_time: number; // Unix 时间戳（秒）
  send_success_total: number; // 累计发送成功消息数
  send_fail_total: number; // 累计发送失败消息数
  last_msg: string | null; // 最后一条消息
}

export const getConnectorDetail = async (data: ConnectorDetailRequest): Promise<ConnectorDetailResponse> => {
  const response = await requestApi('/api/mqtt/connector/detail', data, 'GET');
  return response;
};

// -------- Schema APIs --------
export interface SchemaRaw {
  tenant: string;
  name: string;
  schema_type: string;
  desc: string;
  schema: string;
}

export const getSchemaListHttp = async (
  query?: QueryOption & { tenant?: string; name?: string },
): Promise<{
  schemasList: SchemaRaw[];
  totalCount: number;
}> => {
  const { tenant, name, ...rest } = (query || {}) as any;
  const httpQuery = convertPaginationForHttpApi(rest) || {};
  const response = await requestApi(
    '/api/mqtt/schema/list',
    {
      ...httpQuery,
      ...(tenant ? { tenant } : {}),
      ...(name ? { name } : {}),
    },
    'GET',
  );
  return {
    schemasList: response.data,
    totalCount: response.total_count,
  };
};

export interface CreateSchemaRequest {
  tenant: string;
  schema_name: string;
  schema_type: string;
  schema: string;
  desc?: string;
}

export const createSchema = async (data: CreateSchemaRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/schema/create', data);
  return response;
};

export interface DeleteSchemaRequest {
  tenant: string;
  schema_name: string;
}

export const deleteSchema = async (data: DeleteSchemaRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/schema/delete', data);
  return response;
};

// -------- Schema Bind APIs --------
export interface SchemaBindItem {
  data_type: string;
  data: string[];
}

export interface GetSchemaBindListRequest {
  resource_name?: string;
  schema_name?: string;
  limit?: number;
  page?: number;
  sort_field?: string;
  sort_by?: string;
  filter_field?: string;
  filter_values?: string[];
  exact_match?: string;
}

export const getSchemaBindList = async (
  resource_name?: string,
  schema_name?: string,
): Promise<{
  schemaBindList: SchemaBindItem[];
  totalCount: number;
}> => {
  const request: GetSchemaBindListRequest = {};
  if (resource_name) {
    request.resource_name = resource_name;
  }
  if (schema_name) {
    request.schema_name = schema_name;
  }
  const response = await requestApi('/api/mqtt/schema-bind/list', request, 'GET');
  return {
    schemaBindList: response.data || [],
    totalCount: response.total_count || 0,
  };
};

export interface CreateSchemaBindRequest {
  schema_name: string;
  resource_name: string;
}

export const createSchemaBind = async (data: CreateSchemaBindRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/schema-bind/create', data);
  return response;
};

export interface DeleteSchemaBindRequest {
  schema_name: string;
  resource_name: string;
}

export const deleteSchemaBind = async (data: DeleteSchemaBindRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/schema-bind/delete', data);
  return response;
};

// -------- Auto Subscribe APIs --------
export interface AutoSubscribeRaw {
  name: string;
  tenant: string;
  topic: string;
  qos: string;
  no_local: boolean;
  retain_as_published: boolean;
  retained_handling: string;
  desc?: string;
}

export const getAutoSubscribeListHttp = async (
  query?: QueryOption & { tenant?: string; name?: string },
): Promise<{
  autoSubscribesList: AutoSubscribeRaw[];
  totalCount: number;
}> => {
  const { tenant, name, ...rest } = query ?? {};
  const httpQuery = convertPaginationForHttpApi(rest);
  const response = await requestApi(
    '/api/mqtt/auto-subscribe/list',
    { ...httpQuery, ...(tenant ? { tenant } : {}), ...(name ? { name } : {}) },
    'GET',
  );
  return {
    autoSubscribesList: response.data,
    totalCount: response.total_count,
  };
};

export interface CreateAutoSubscribeRequest {
  name: string;
  tenant: string;
  topic: string;
  qos: number;
  no_local: boolean;
  retain_as_published: boolean;
  retained_handling: number;
  desc?: string;
}

export const createAutoSubscribe = async (data: CreateAutoSubscribeRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/auto-subscribe/create', data);
  return response;
};

export interface DeleteAutoSubscribeRequest {
  tenant: string;
  name: string;
}

export const deleteAutoSubscribe = async (data: DeleteAutoSubscribeRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/auto-subscribe/delete', data);
  return response;
};

// -------- Slow Subscribe APIs --------
export interface SlowSubscribeRaw {
  tenant: string;
  client_id: string;
  topic_name: string;
  time_span: number;
  node_info: string;
  create_time: string;
  subscribe_name: string;
}

export const getSlowSubscribeListHttp = async (
  query?: QueryOption & { tenant?: string; client_id?: string },
): Promise<{
  slowSubscribesList: SlowSubscribeRaw[];
  totalCount: number;
}> => {
  const { tenant, client_id, ...rest } = query ?? {};
  const httpQuery = convertPaginationForHttpApi(rest);
  const response = await requestApi(
    '/api/mqtt/slow-subscribe/list',
    { ...httpQuery, ...(tenant ? { tenant } : {}), ...(client_id ? { client_id } : {}) },
    'GET',
  );
  return {
    slowSubscribesList: response.data,
    totalCount: response.total_count,
  };
};

// -------- Topic Rewrite APIs --------
export interface TopicRewriteRaw {
  name: string;
  tenant: string;
  source_topic: string;
  dest_topic: string;
  regex: string;
  action: string;
  desc?: string;
}

export const getTopicRewriteListHttp = async (
  query?: QueryOption & { tenant?: string; name?: string },
): Promise<{
  topicRewritesList: TopicRewriteRaw[];
  totalCount: number;
}> => {
  const { tenant, name, ...rest } = query ?? {};
  const httpQuery = convertPaginationForHttpApi(rest);
  const response = await requestApi(
    '/api/mqtt/topic-rewrite/list',
    { ...httpQuery, ...(tenant ? { tenant } : {}), ...(name ? { name } : {}) },
    'GET',
  );
  return {
    topicRewritesList: response.data,
    totalCount: response.total_count,
  };
};

export interface CreateTopicRewriteRequest {
  name: string;
  tenant: string;
  action: string;
  source_topic: string;
  dest_topic: string;
  regex: string;
  desc?: string;
}

export const createTopicRewrite = async (data: CreateTopicRewriteRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/topic-rewrite/create', data);
  return response;
};

export interface DeleteTopicRewriteRequest {
  tenant: string;
  name: string;
}

export const deleteTopicRewrite = async (data: DeleteTopicRewriteRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/topic-rewrite/delete', data);
  return response;
};

// -------- System Alarm APIs --------
export interface SystemAlarmRaw {
  name: string;
  message: string;
  activate_at: string;
  activated: boolean;
}

export const getSystemAlarmListHttp = async (
  query?: QueryOption,
): Promise<{
  systemAlarmsList: SystemAlarmRaw[];
  totalCount: number;
}> => {
  const httpQuery = convertPaginationForHttpApi(query);
  const response = await requestApi('/api/mqtt/system-alarm/list', httpQuery, 'GET');
  return {
    systemAlarmsList: response.data,
    totalCount: response.total_count,
  };
};

// -------- Connection Jitter (Flapping Detect) APIs --------
export interface ConnectionJitterRaw {
  tenant: string;
  client_id: string;
  before_last_window_connections: number;
  first_request_time: number;
}

export const getConnectionJitterListHttp = async (
  query?: QueryOption & { tenant?: string; client_id?: string },
): Promise<{
  connectionJittersList: ConnectionJitterRaw[];
  totalCount: number;
}> => {
  const { tenant, client_id, ...rest } = query ?? {};
  const httpQuery = convertPaginationForHttpApi(rest);
  const response = await requestApi(
    '/api/mqtt/flapping_detect/list',
    { ...httpQuery, ...(tenant ? { tenant } : {}), ...(client_id ? { client_id } : {}) },
    'GET',
  );
  return {
    connectionJittersList: response.data,
    totalCount: response.total_count,
  };
};

// -------- Ban Log APIs --------
export interface BanLogRaw {
  tenant: string;
  ban_type: string;
  resource_name: string;
  ban_source: string;
  end_time: string;
  create_time: string;
}

export const getBanLogListHttp = async (
  query?: QueryOption & { tenant?: string },
): Promise<{
  banLogsList: BanLogRaw[];
  totalCount: number;
}> => {
  const { tenant, ...rest } = query ?? {};
  const httpQuery = convertPaginationForHttpApi(rest);
  const response = await requestApi('/api/mqtt/ban-log/list', { ...httpQuery, ...(tenant ? { tenant } : {}) }, 'GET');
  return {
    banLogsList: response.data,
    totalCount: response.total_count,
  };
};

// -------- Pub/Sub APIs --------
export interface SendMessageRequest {
  tenant: string;
  topic: string;
  payload: string;
  retain: boolean;
}

export const sendMessage = async (data: SendMessageRequest): Promise<{ offsets: number[] }> => {
  const response = await requestApi('/api/mqtt/message/send', data);
  return response;
};

export interface MessageItem {
  offset: number;
  content: string;
  timestamp: number;
}

export interface ReadMessageRequest {
  tenant: string;
  topic: string;
  offset: number;
}

export const readMessages = async (data: ReadMessageRequest): Promise<MessageItem[]> => {
  const response = await requestApi('/api/mqtt/message/read', data);
  return response.messages || [];
};

// -------- Configuration APIs --------
export interface LimitQuota {
  max_connections_per_node: number;
  max_connection_rate: number;
  max_topics: number;
  max_sessions: number;
  max_publish_rate: number;
}

export interface ClusterConfig {
  cluster_name: string;
  broker_id: number;
  broker_ip: string | null;
  roles: string[];
  grpc_port: number;
  http_port: number;
  meta_addrs: Record<string, string>;
  prometheus: {
    enable: boolean;
    port: number;
  };
  log: {
    log_path: string;
    log_config: string;
  };
  runtime: {
    runtime_worker_threads: number;
    server_worker_threads: number;
    meta_worker_threads: number;
    broker_worker_threads: number;
    channels_per_address: number;
    tls_cert: string;
    tls_key: string;
  };
  network: {
    accept_thread_num: number;
    handler_thread_num: number;
    queue_size: number;
  };
  pprof: {
    enable: boolean;
    port: number;
    frequency: number;
  };
  rocksdb: {
    data_path: string;
    max_open_files: number;
  };
  meta_runtime: {
    heartbeat_timeout_ms: number;
    heartbeat_check_time_ms: number;
    raft_write_timeout_sec: number;
    offset_raft_group_num: number;
    data_raft_group_num: number;
  };
  storage_runtime: {
    tcp_port: number;
    max_segment_size: number;
    io_thread_num: number;
    data_path: string[];
    offset_enable_cache: boolean;
  };
  mqtt_server: {
    tcp_port: number;
    tls_port: number;
    websocket_port: number;
    websockets_port: number;
    quic_port: number;
  };
  mqtt_keep_alive: {
    enable: boolean;
    default_time: number;
    max_time: number;
    default_timeout: number;
  };
  mqtt_runtime: {
    default_user: string;
    default_password: string;
    durable_sessions_enable: boolean;
    secret_free_login: boolean;
    is_self_protection_status: boolean;
  };
  mqtt_offline_message: {
    enable: boolean;
    expire_ms: number;
    max_messages_num: number;
  };
  mqtt_slow_subscribe: {
    enable: boolean;
    record_time: number;
    delay_type: string;
  };
  mqtt_flapping_detect: {
    enable: boolean;
    window_time: number;
    max_client_connections: number;
    ban_time: number;
  };
  mqtt_protocol: {
    max_session_expiry_interval: number;
    default_session_expiry_interval: number;
    topic_alias_max: number;
    max_qos_flight_message?: number;
    max_packet_size: number;
    receive_max: number;
    max_message_expiry_interval: number;
    client_pkid_persistent: boolean;
  };
  mqtt_schema: {
    enable: boolean;
    strategy: string;
    failed_operation: string;
    echo_log: boolean;
    log_level: string;
  };
  mqtt_system_monitor: {
    enable: boolean;
    os_cpu_high_watermark: number;
    os_memory_high_watermark: number;
    system_topic_interval_ms: number;
  };
  cluster_limit: {
    max_network_connection: number;
    max_network_connection_rate: number;
    max_admin_http_uri_rate: number;
  };
  mqtt_limit: {
    cluster: LimitQuota;
    tenant: LimitQuota;
  };
  llm_client: {
    platform: string;
    model: string;
    token: string | null;
    base_url: string | null;
  } | null;
}

export const getClusterConfig = async (): Promise<ClusterConfig> => {
  const response = await requestApi('/api/cluster/config/get', undefined, 'GET');
  return response;
};

// -------- Cluster Status APIs --------
export interface BrokerNode {
  roles: string[];
  extend?: {
    mqtt?: {
      grpc_addr?: string;
      mqtt_addr?: string;
      mqtts_addr?: string;
      websocket_addr?: string;
      websockets_addr?: string;
      quic_addr?: string;
    };
  };
  node_id: number;
  node_ip: string;
  grpc_addr: string;
  engine_addr?: string;
  start_time: number;
  register_time: number;
  storage_fold?: string[];
}

export interface RaftLeaderId {
  term: number;
  node_id: number;
}

export interface RaftLogId {
  leader_id: RaftLeaderId;
  index: number;
}

export interface RaftMembershipNode {
  node_id: number;
  rpc_addr: string;
}

export interface RaftState {
  running_state: { Ok: null } | { [key: string]: any };
  id: number;
  current_term: number;
  vote: {
    leader_id: RaftLeaderId;
    committed: boolean;
  };
  last_log_index: number;
  last_applied: RaftLogId;
  snapshot: RaftLogId;
  purged: RaftLogId;
  state: string;
  current_leader: number;
  millis_since_quorum_ack: number;
  last_quorum_acked: number;
  membership_config: {
    log_id: RaftLogId;
    membership: {
      configs: number[][];
      nodes: Record<string, RaftMembershipNode>;
    };
  };
  heartbeat: Record<string, any>;
  replication: Record<string, RaftLogId>;
}

export interface ClusterStatus {
  cluster_name: string;
  version: string;
  start_time: number;
  nodes: string[];
  broker_node_list: BrokerNode[];
  meta: {
    offset: RaftState;
    mqtt: RaftState;
    meta: RaftState;
  };
}

export const getClusterStatus = async (): Promise<ClusterStatus> => {
  const response = await requestApi('/api/status', undefined, 'GET');
  return response;
};

/** Tenant API */
export interface TenantConfig {
  max_connections_per_node?: number;
  max_create_connection_rate_per_second?: number;
  max_topics?: number;
  max_sessions?: number;
  max_publish_rate?: number;
}

export interface TenantRaw {
  tenant_name: string;
  desc: string;
  config: TenantConfig;
  create_time: number;
}

export interface CreateTenantRequest {
  tenant_name: string;
  desc?: string;
  config?: TenantConfig;
}

export interface UpdateTenantRequest {
  tenant_name: string;
  desc?: string;
  config?: TenantConfig;
}

export interface DeleteTenantRequest {
  tenant_name: string;
}

export const getTenantList = async (query?: QueryOption): Promise<{ tenantList: TenantRaw[]; totalCount: number }> => {
  const response = await requestApi('/api/tenant/list', query || {}, 'GET');
  return {
    tenantList: response.data,
    totalCount: response.total_count,
  };
};

export const createTenant = async (data: CreateTenantRequest): Promise<string> => {
  const response = await requestApi('/api/tenant/create', data);
  return response;
};

export const deleteTenant = async (data: DeleteTenantRequest): Promise<string> => {
  const response = await requestApi('/api/tenant/delete', data);
  return response;
};

export const updateTenant = async (data: UpdateTenantRequest): Promise<string> => {
  const response = await requestApi('/api/tenant/update', data);
  return response;
};
