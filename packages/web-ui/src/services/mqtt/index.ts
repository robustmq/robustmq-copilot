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

  const response = await requestApi('/api/mqtt/monitor/data', request);

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
}

export const getOverviewStatusData = async (): Promise<OverviewStatusData> => {
  const response = await requestApi('/api/mqtt/overview');
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
    [key: string]: any;
  };
  mqtt_connection: {
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
  query?: QueryOption,
): Promise<{
  clientsList: ClientRaw[];
  totalCount: number;
}> => {
  const httpQuery = convertPaginationForHttpApi(query);
  const response = await requestApi('/api/mqtt/client/list', httpQuery);
  return {
    clientsList: response.data,
    totalCount: response.total_count,
  };
};

// -------- Session APIs --------
export interface SessionRaw {
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
  query?: QueryOption,
): Promise<{
  sessionsList: SessionRaw[];
  totalCount: number;
}> => {
  const httpQuery = convertPaginationForHttpApi(query);
  const response = await requestApi('/api/mqtt/session/list', httpQuery);
  return {
    sessionsList: response.data,
    totalCount: response.total_count,
  };
};

// -------- Topic APIs --------
export interface TopicRaw {
  topic_id: string;
  topic_name: string;
  is_contain_retain_message: boolean;
}

export const getTopicListHttp = async (
  query?: QueryOption,
): Promise<{
  topicsList: TopicRaw[];
  totalCount: number;
}> => {
  const httpQuery = convertPaginationForHttpApi(query);
  const response = await requestApi('/api/mqtt/topic/list', httpQuery);
  return {
    topicsList: response.data,
    totalCount: response.total_count,
  };
};

export interface TopicSubscription {
  client_id: string;
  path: string;
}

export interface TopicDetail {
  topic_info: {
    cluster_name: string;
    topic_name: string;
    create_time: number;
  };
  retain_message: string | null; // Base64 编码的字符串或 null
  retain_message_at: number | null; // 毫秒级时间戳或 null
  sub_list: TopicSubscription[];
}

export const getTopicDetail = async (topicName: string): Promise<TopicDetail> => {
  const response = await requestApi('/api/mqtt/topic/detail', { topic_name: topicName });
  return {
    topic_info: response.topic_info,
    retain_message: response.retain_message,
    retain_message_at: response.retain_message_at,
    sub_list: response.sub_list || [],
  };
};

export interface DeleteTopicRequest {
  topic_name: string;
}

export const deleteTopic = async (data: DeleteTopicRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/topic/delete', data);
  return response;
};

// -------- Subscribe APIs --------
export interface SubscribeRaw {
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
  query?: QueryOption,
): Promise<{
  subscriptionsList: SubscribeRaw[];
  totalCount: number;
}> => {
  const httpQuery = convertPaginationForHttpApi(query);
  const response = await requestApi('/api/mqtt/subscribe/list', httpQuery);
  return {
    subscriptionsList: response.data,
    totalCount: response.total_count,
  };
};

// 订阅详情相关类型定义
export interface PushThreadInfo {
  push_success_record_num: number;
  push_error_record_num: number;
  last_push_time: number; // 秒级时间戳
  last_run_time: number; // 秒级时间戳
  create_time: number; // 秒级时间戳
}

export interface ExclusivePushData {
  protocol: string;
  client_id: string;
  sub_path: string;
  rewrite_sub_path: string | null;
  topic_name: string;
  group_name: string | null;
  qos: string;
  nolocal: boolean;
  preserve_retain: boolean;
  retain_forward_rule: string;
  subscription_identifier: number | null;
  create_time: number; // 秒级时间戳
}

export interface SharePushData {
  path: string;
  group_name: string;
  sub_name: string;
  topic_name: string;
  sub_list: Record<string, ExclusivePushData>;
}

export interface TopicListItem {
  client_id: string;
  path: string;
  topic_name: string;
  exclusive_push_data: ExclusivePushData | null;
  share_push_data: SharePushData | null;
  push_thread: PushThreadInfo | null;
  connector_name?: string;
  connector_type?: string;
  connector_config?: string; // JSON string
}

export interface GroupLeaderInfo {
  broker_id: number;
  broker_addr: string;
  extend_info: string;
}

export interface SubscribeDetail {
  share_sub: boolean;
  group_leader_info: GroupLeaderInfo | null;
  topic_list: TopicListItem[];
}

export interface GetSubscribeDetailRequest {
  client_id: string;
  path: string;
}

export const getSubscribeDetail = async (data: GetSubscribeDetailRequest): Promise<SubscribeDetail> => {
  const response = await requestApi('/api/mqtt/subscribe/detail', data);
  return {
    share_sub: response.share_sub,
    group_leader_info: response.group_leader_info,
    topic_list: response.topic_list || [],
  };
};

// -------- User APIs --------
export interface UserRaw {
  username: string;
  is_superuser: boolean;
  create_time?: number; // Unix timestamp in seconds
}

export const getUserList = async (
  query?: QueryOption,
): Promise<{
  usersList: UserRaw[];
  totalCount: number;
}> => {
  const response = await requestApi('/api/mqtt/user/list', query || {});
  return {
    usersList: response.data,
    totalCount: response.total_count,
  };
};

export interface CreateUserRequest {
  username: string;
  password: string;
  is_superuser: boolean;
}

export const createUser = async (data: CreateUserRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/user/create', data);
  return response;
};

export interface DeleteUserRequest {
  username: string;
}

export const deleteUser = async (data: DeleteUserRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/user/delete', data);
  return response;
};

// -------- ACL APIs --------
export interface AclRaw {
  resource_type: string;
  resource_name: string;
  topic: string;
  ip: string;
  action: string;
  permission: string;
}

export const getAclListHttp = async (
  query?: QueryOption,
): Promise<{
  aclsList: AclRaw[];
  totalCount: number;
}> => {
  const httpQuery = convertPaginationForHttpApi(query);
  const response = await requestApi('/api/mqtt/acl/list', httpQuery);
  return {
    aclsList: response.data,
    totalCount: response.total_count,
  };
};

export interface CreateAclRequest {
  resource_type: string;
  resource_name: string;
  topic: string;
  ip: string;
  action: string;
  permission: string;
}

export const createAcl = async (data: CreateAclRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/acl/create', data);
  return response;
};

export interface DeleteAclRequest {
  resource_type: string;
  resource_name: string;
  topic: string;
  ip: string;
  action: string;
  permission: string;
}

export const deleteAcl = async (data: DeleteAclRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/acl/delete', data);
  return response;
};

// -------- Blacklist APIs --------
export interface BlacklistRaw {
  blacklist_type: string;
  resource_name: string;
  desc: string;
  end_time: string; // String format: "yyyy-MM-dd HH:mm:ss"
}

export const getBlacklistListHttp = async (
  query?: QueryOption,
): Promise<{
  blacklistsList: BlacklistRaw[];
  totalCount: number;
}> => {
  const httpQuery = convertPaginationForHttpApi(query);
  const response = await requestApi('/api/mqtt/blacklist/list', httpQuery);
  return {
    blacklistsList: response.data,
    totalCount: response.total_count,
  };
};

export interface CreateBlacklistRequest {
  blacklist_type: string;
  resource_name: string;
  end_time: number;
  desc: string;
}

export const createBlacklist = async (data: CreateBlacklistRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/blacklist/create', data);
  return response;
};

export interface DeleteBlacklistRequest {
  blacklist_type: string;
  resource_name: string;
  end_time: number;
  desc: string;
}

export const deleteBlacklist = async (data: DeleteBlacklistRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/blacklist/delete', data);
  return response;
};

// -------- Connector APIs --------
export interface ConnectorRaw {
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
): Promise<{
  connectorsList: ConnectorRaw[];
  totalCount: number;
}> => {
  const httpQuery = convertPaginationForHttpApi(query);
  const response = await requestApi('/api/mqtt/connector/list', httpQuery);
  return {
    connectorsList: response.data,
    totalCount: response.total_count,
  };
};

export interface CreateConnectorRequest {
  connector_name: string;
  connector_type: string;
  config: string; // JSON string
  topic_name: string;
}

export const createConnector = async (data: CreateConnectorRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/connector/create', data);
  return response;
};

export interface DeleteConnectorRequest {
  connector_name: string;
}

export const deleteConnector = async (data: DeleteConnectorRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/connector/delete', data);
  return response;
};

export interface ConnectorDetailRequest {
  connector_name: string;
}

export interface ConnectorDetailResponse {
  last_send_time: number; // Unix 时间戳（秒）
  send_success_total: number; // 累计发送成功消息数
  send_fail_total: number; // 累计发送失败消息数
  last_msg: string | null; // 最后一条消息
}

export const getConnectorDetail = async (data: ConnectorDetailRequest): Promise<ConnectorDetailResponse> => {
  const response = await requestApi('/api/mqtt/connector/detail', data);
  return response;
};

// -------- Schema APIs --------
export interface SchemaRaw {
  name: string;
  schema_type: string;
  desc: string;
  schema: string;
}

export const getSchemaListHttp = async (
  query?: QueryOption,
): Promise<{
  schemasList: SchemaRaw[];
  totalCount: number;
}> => {
  const httpQuery = convertPaginationForHttpApi(query) || {};
  const response = await requestApi('/api/mqtt/schema/list', httpQuery);
  return {
    schemasList: response.data,
    totalCount: response.total_count,
  };
};

export interface CreateSchemaRequest {
  schema_name: string;
  schema_type: string;
  schema: string;
  desc: string;
}

export const createSchema = async (data: CreateSchemaRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/schema/create', data);
  return response;
};

export interface DeleteSchemaRequest {
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
  const response = await requestApi('/api/mqtt/schema-bind/list', request);
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
  topic: string;
  qos: string;
  no_local: boolean;
  retain_as_published: boolean;
  retained_handling: string;
}

export const getAutoSubscribeListHttp = async (
  query?: QueryOption,
): Promise<{
  autoSubscribesList: AutoSubscribeRaw[];
  totalCount: number;
}> => {
  const httpQuery = convertPaginationForHttpApi(query);
  const response = await requestApi('/api/mqtt/auto-subscribe/list', httpQuery);
  return {
    autoSubscribesList: response.data,
    totalCount: response.total_count,
  };
};

export interface CreateAutoSubscribeRequest {
  topic: string;
  qos: number;
  no_local: boolean;
  retain_as_published: boolean;
  retained_handling: number;
}

export const createAutoSubscribe = async (data: CreateAutoSubscribeRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/auto-subscribe/create', data);
  return response;
};

export interface DeleteAutoSubscribeRequest {
  topic_name: string;
}

export const deleteAutoSubscribe = async (data: DeleteAutoSubscribeRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/auto-subscribe/delete', data);
  return response;
};

// -------- Slow Subscribe APIs --------
export interface SlowSubscribeRaw {
  client_id: string;
  topic_name: string;
  time_span: number;
  node_info: string;
  create_time: string;
  subscribe_name: string;
}

export const getSlowSubscribeListHttp = async (
  query?: QueryOption,
): Promise<{
  slowSubscribesList: SlowSubscribeRaw[];
  totalCount: number;
}> => {
  const httpQuery = convertPaginationForHttpApi(query);
  const response = await requestApi('/api/mqtt/slow-subscribe/list', httpQuery);
  return {
    slowSubscribesList: response.data,
    totalCount: response.total_count,
  };
};

// -------- Topic Rewrite APIs --------
export interface TopicRewriteRaw {
  source_topic: string;
  dest_topic: string;
  regex: string;
  action: string;
}

export const getTopicRewriteListHttp = async (
  query?: QueryOption,
): Promise<{
  topicRewritesList: TopicRewriteRaw[];
  totalCount: number;
}> => {
  const httpQuery = convertPaginationForHttpApi(query);
  const response = await requestApi('/api/mqtt/topic-rewrite/list', httpQuery);
  return {
    topicRewritesList: response.data,
    totalCount: response.total_count,
  };
};

export interface CreateTopicRewriteRequest {
  action: string;
  source_topic: string;
  dest_topic: string;
  regex: string;
}

export const createTopicRewrite = async (data: CreateTopicRewriteRequest): Promise<string> => {
  const response = await requestApi('/api/mqtt/topic-rewrite/create', data);
  return response;
};

export interface DeleteTopicRewriteRequest {
  action: string;
  source_topic: string;
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
  const response = await requestApi('/api/mqtt/system-alarm/list', httpQuery);
  return {
    systemAlarmsList: response.data,
    totalCount: response.total_count,
  };
};

// -------- Connection Jitter (Flapping Detect) APIs --------
export interface ConnectionJitterRaw {
  client_id: string;
  before_last_windows_connections: number;
  first_request_time: number;
}

export const getConnectionJitterListHttp = async (
  query?: QueryOption,
): Promise<{
  connectionJittersList: ConnectionJitterRaw[];
  totalCount: number;
}> => {
  const httpQuery = convertPaginationForHttpApi(query);
  const response = await requestApi('/api/mqtt/flapping_detect/list', httpQuery);
  return {
    connectionJittersList: response.data,
    totalCount: response.total_count,
  };
};

// -------- Ban Log APIs --------
export interface BanLogRaw {
  id: string;
  ban_type: string;
  resource_name: string;
  reason: string;
  ban_time: number;
  expire_time: number;
  operator: string;
}

export const getBanLogListHttp = async (
  query?: QueryOption,
): Promise<{
  banLogsList: BanLogRaw[];
  totalCount: number;
}> => {
  const httpQuery = convertPaginationForHttpApi(query);
  const response = await requestApi('/api/mqtt/ban-log/list', httpQuery);
  return {
    banLogsList: response.data,
    totalCount: response.total_count,
  };
};

// -------- Pub/Sub APIs --------
export interface SendMessageRequest {
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
  topic: string;
  offset: number;
}

export const readMessages = async (data: ReadMessageRequest): Promise<MessageItem[]> => {
  const response = await requestApi('/api/mqtt/message/read', data);
  return response.messages || [];
};

// -------- Configuration APIs --------
export interface ClusterConfig {
  cluster_name: string;
  broker_id: number;
  roles: string[];
  grpc_port: number;
  http_port: number;
  meta_addrs: Record<string, string>;
  prometheus: {
    enable: boolean;
    port: number;
  };
  log: {
    log_config: string;
    log_path: string;
  };
  runtime: {
    runtime_worker_threads: number;
    tls_cert: string;
    tls_key: string;
  };
  network: {
    accept_thread_num: number;
    handler_thread_num: number;
    response_thread_num: number;
    queue_size: number;
    lock_max_try_mut_times: number;
    lock_try_mut_sleep_time_ms: number;
  };
  p_prof: {
    enable: boolean;
    port: number;
    frequency: number;
  };
  meta_runtime: {
    heartbeat_timeout_ms: number;
    heartbeat_check_time_ms: number;
  };
  rocksdb: {
    data_path: string;
    max_open_files: number;
  };
  journal_server: {
    tcp_port: number;
  };
  journal_runtime: {
    enable_auto_create_shard: boolean;
    shard_replica_num: number;
    max_segment_size: number;
  };
  journal_storage: {
    data_path: string[];
    rocksdb_max_open_files: number;
  };
  mqtt_server: {
    tcp_port: number;
    tls_port: number;
    websocket_port: number;
    websockets_port: number;
    quic_port: number;
  };
  mqtt_auth_storage: {
    storage_type: string;
    journal_addr: string;
    mysql_addr: string;
  };
  mqtt_message_storage: {
    storage_type: string;
    journal_addr: string;
    mysql_addr: string;
    rocksdb_data_path: string;
    rocksdb_max_open_files: number;
  };
  mqtt_runtime: {
    default_user: string;
    default_password: string;
    max_connection_num: number;
  };
  mqtt_offline_message: {
    enable: boolean;
    expire_ms: number;
    max_messages_num: number;
  };
  mqtt_slow_subscribe_config: {
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
  mqtt_protocol_config: {
    max_session_expiry_interval: number;
    default_session_expiry_interval: number;
    topic_alias_max: number;
    max_qos: number;
    max_packet_size: number;
    max_server_keep_alive: number;
    default_server_keep_alive: number;
    receive_max: number;
    max_message_expiry_interval: number;
    client_pkid_persistent: boolean;
  };
  mqtt_security: {
    is_self_protection_status: boolean;
    secret_free_login: boolean;
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
  };
}

export const getClusterConfig = async (): Promise<ClusterConfig> => {
  const response = await requestApi('/api/cluster/config/get', {});
  return response;
};

// -------- Cluster Status APIs --------
export interface BrokerNode {
  cluster_name: string;
  cluster_type: string;
  extend_info: string;
  node_id: number;
  node_ip: string;
  node_inner_addr: string;
  start_time: string;
  register_time: string;
  roles: string[];
  [key: string]: any;
}

export interface ClusterStatus {
  cluster_name: string;
  version: string;
  start_time: string;
  broker_node_list: BrokerNode[];
  meta: {
    replication: {
      [key: string]: any;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

export const getClusterStatus = async (): Promise<ClusterStatus> => {
  const response = await requestApi('/api/status', {});
  return response;
};
