import * as jspb from 'google-protobuf'



export class Pagination extends jspb.Message {
  getLimit(): number;
  setLimit(value: number): Pagination;

  getOffset(): number;
  setOffset(value: number): Pagination;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Pagination.AsObject;
  static toObject(includeInstance: boolean, msg: Pagination): Pagination.AsObject;
  static serializeBinaryToWriter(message: Pagination, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Pagination;
  static deserializeBinaryFromReader(message: Pagination, reader: jspb.BinaryReader): Pagination;
}

export namespace Pagination {
  export type AsObject = {
    limit: number,
    offset: number,
  }
}

export class Filter extends jspb.Message {
  getField(): string;
  setField(value: string): Filter;

  getValuesList(): Array<string>;
  setValuesList(value: Array<string>): Filter;
  clearValuesList(): Filter;
  addValues(value: string, index?: number): Filter;

  getExactMatch(): MatchMode;
  setExactMatch(value: MatchMode): Filter;
  hasExactMatch(): boolean;
  clearExactMatch(): Filter;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Filter.AsObject;
  static toObject(includeInstance: boolean, msg: Filter): Filter.AsObject;
  static serializeBinaryToWriter(message: Filter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Filter;
  static deserializeBinaryFromReader(message: Filter, reader: jspb.BinaryReader): Filter;
}

export namespace Filter {
  export type AsObject = {
    field: string,
    valuesList: Array<string>,
    exactMatch?: MatchMode,
  }

  export enum ExactMatchCase { 
    _EXACT_MATCH_NOT_SET = 0,
    EXACT_MATCH = 3,
  }
}

export class Sorting extends jspb.Message {
  getOrderBy(): string;
  setOrderBy(value: string): Sorting;

  getDirection(): OrderDirection;
  setDirection(value: OrderDirection): Sorting;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Sorting.AsObject;
  static toObject(includeInstance: boolean, msg: Sorting): Sorting.AsObject;
  static serializeBinaryToWriter(message: Sorting, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Sorting;
  static deserializeBinaryFromReader(message: Sorting, reader: jspb.BinaryReader): Sorting;
}

export namespace Sorting {
  export type AsObject = {
    orderBy: string,
    direction: OrderDirection,
  }
}

export class QueryOptions extends jspb.Message {
  getPagination(): Pagination | undefined;
  setPagination(value?: Pagination): QueryOptions;
  hasPagination(): boolean;
  clearPagination(): QueryOptions;

  getFiltersList(): Array<Filter>;
  setFiltersList(value: Array<Filter>): QueryOptions;
  clearFiltersList(): QueryOptions;
  addFilters(value?: Filter, index?: number): Filter;

  getSorting(): Sorting | undefined;
  setSorting(value?: Sorting): QueryOptions;
  hasSorting(): boolean;
  clearSorting(): QueryOptions;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryOptions.AsObject;
  static toObject(includeInstance: boolean, msg: QueryOptions): QueryOptions.AsObject;
  static serializeBinaryToWriter(message: QueryOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryOptions;
  static deserializeBinaryFromReader(message: QueryOptions, reader: jspb.BinaryReader): QueryOptions;
}

export namespace QueryOptions {
  export type AsObject = {
    pagination?: Pagination.AsObject,
    filtersList: Array<Filter.AsObject>,
    sorting?: Sorting.AsObject,
  }

  export enum PaginationCase { 
    _PAGINATION_NOT_SET = 0,
    PAGINATION = 1,
  }

  export enum SortingCase { 
    _SORTING_NOT_SET = 0,
    SORTING = 3,
  }
}

export class SetClusterConfigRequest extends jspb.Message {
  getFeatureName(): string;
  setFeatureName(value: string): SetClusterConfigRequest;

  getIsEnable(): boolean;
  setIsEnable(value: boolean): SetClusterConfigRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetClusterConfigRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetClusterConfigRequest): SetClusterConfigRequest.AsObject;
  static serializeBinaryToWriter(message: SetClusterConfigRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetClusterConfigRequest;
  static deserializeBinaryFromReader(message: SetClusterConfigRequest, reader: jspb.BinaryReader): SetClusterConfigRequest;
}

export namespace SetClusterConfigRequest {
  export type AsObject = {
    featureName: string,
    isEnable: boolean,
  }
}

export class SetClusterConfigReply extends jspb.Message {
  getFeatureName(): string;
  setFeatureName(value: string): SetClusterConfigReply;

  getIsEnable(): boolean;
  setIsEnable(value: boolean): SetClusterConfigReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetClusterConfigReply.AsObject;
  static toObject(includeInstance: boolean, msg: SetClusterConfigReply): SetClusterConfigReply.AsObject;
  static serializeBinaryToWriter(message: SetClusterConfigReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetClusterConfigReply;
  static deserializeBinaryFromReader(message: SetClusterConfigReply, reader: jspb.BinaryReader): SetClusterConfigReply;
}

export namespace SetClusterConfigReply {
  export type AsObject = {
    featureName: string,
    isEnable: boolean,
  }
}

export class GetClusterConfigRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetClusterConfigRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetClusterConfigRequest): GetClusterConfigRequest.AsObject;
  static serializeBinaryToWriter(message: GetClusterConfigRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetClusterConfigRequest;
  static deserializeBinaryFromReader(message: GetClusterConfigRequest, reader: jspb.BinaryReader): GetClusterConfigRequest;
}

export namespace GetClusterConfigRequest {
  export type AsObject = {
  }
}

export class GetClusterConfigReply extends jspb.Message {
  getMqttBrokerClusterDynamicConfig(): Uint8Array | string;
  getMqttBrokerClusterDynamicConfig_asU8(): Uint8Array;
  getMqttBrokerClusterDynamicConfig_asB64(): string;
  setMqttBrokerClusterDynamicConfig(value: Uint8Array | string): GetClusterConfigReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetClusterConfigReply.AsObject;
  static toObject(includeInstance: boolean, msg: GetClusterConfigReply): GetClusterConfigReply.AsObject;
  static serializeBinaryToWriter(message: GetClusterConfigReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetClusterConfigReply;
  static deserializeBinaryFromReader(message: GetClusterConfigReply, reader: jspb.BinaryReader): GetClusterConfigReply;
}

export namespace GetClusterConfigReply {
  export type AsObject = {
    mqttBrokerClusterDynamicConfig: Uint8Array | string,
  }
}

export class ClusterStatusRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClusterStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ClusterStatusRequest): ClusterStatusRequest.AsObject;
  static serializeBinaryToWriter(message: ClusterStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClusterStatusRequest;
  static deserializeBinaryFromReader(message: ClusterStatusRequest, reader: jspb.BinaryReader): ClusterStatusRequest;
}

export namespace ClusterStatusRequest {
  export type AsObject = {
  }
}

export class ClusterStatusReply extends jspb.Message {
  getClusterName(): string;
  setClusterName(value: string): ClusterStatusReply;

  getMessageInRate(): number;
  setMessageInRate(value: number): ClusterStatusReply;

  getMessageOutRate(): number;
  setMessageOutRate(value: number): ClusterStatusReply;

  getConnectionNum(): number;
  setConnectionNum(value: number): ClusterStatusReply;

  getSessionNum(): number;
  setSessionNum(value: number): ClusterStatusReply;

  getTopicNum(): number;
  setTopicNum(value: number): ClusterStatusReply;

  getNodesList(): Array<BrokerNodeRaw>;
  setNodesList(value: Array<BrokerNodeRaw>): ClusterStatusReply;
  clearNodesList(): ClusterStatusReply;
  addNodes(value?: BrokerNodeRaw, index?: number): BrokerNodeRaw;

  getPlacementStatus(): string;
  setPlacementStatus(value: string): ClusterStatusReply;

  getTcpConnectionNum(): number;
  setTcpConnectionNum(value: number): ClusterStatusReply;

  getTlsConnectionNum(): number;
  setTlsConnectionNum(value: number): ClusterStatusReply;

  getWebsocketConnectionNum(): number;
  setWebsocketConnectionNum(value: number): ClusterStatusReply;

  getQuicConnectionNum(): number;
  setQuicConnectionNum(value: number): ClusterStatusReply;

  getSubscribeNum(): number;
  setSubscribeNum(value: number): ClusterStatusReply;

  getExclusiveSubscribeNum(): number;
  setExclusiveSubscribeNum(value: number): ClusterStatusReply;

  getShareSubscribeLeaderNum(): number;
  setShareSubscribeLeaderNum(value: number): ClusterStatusReply;

  getShareSubscribeResubNum(): number;
  setShareSubscribeResubNum(value: number): ClusterStatusReply;

  getExclusiveSubscribeThreadNum(): number;
  setExclusiveSubscribeThreadNum(value: number): ClusterStatusReply;

  getShareSubscribeLeaderThreadNum(): number;
  setShareSubscribeLeaderThreadNum(value: number): ClusterStatusReply;

  getShareSubscribeFollowerThreadNum(): number;
  setShareSubscribeFollowerThreadNum(value: number): ClusterStatusReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClusterStatusReply.AsObject;
  static toObject(includeInstance: boolean, msg: ClusterStatusReply): ClusterStatusReply.AsObject;
  static serializeBinaryToWriter(message: ClusterStatusReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClusterStatusReply;
  static deserializeBinaryFromReader(message: ClusterStatusReply, reader: jspb.BinaryReader): ClusterStatusReply;
}

export namespace ClusterStatusReply {
  export type AsObject = {
    clusterName: string,
    messageInRate: number,
    messageOutRate: number,
    connectionNum: number,
    sessionNum: number,
    topicNum: number,
    nodesList: Array<BrokerNodeRaw.AsObject>,
    placementStatus: string,
    tcpConnectionNum: number,
    tlsConnectionNum: number,
    websocketConnectionNum: number,
    quicConnectionNum: number,
    subscribeNum: number,
    exclusiveSubscribeNum: number,
    shareSubscribeLeaderNum: number,
    shareSubscribeResubNum: number,
    exclusiveSubscribeThreadNum: number,
    shareSubscribeLeaderThreadNum: number,
    shareSubscribeFollowerThreadNum: number,
  }
}

export class BrokerNodeRaw extends jspb.Message {
  getClusterName(): string;
  setClusterName(value: string): BrokerNodeRaw;

  getClusterType(): string;
  setClusterType(value: string): BrokerNodeRaw;

  getExtendInfo(): string;
  setExtendInfo(value: string): BrokerNodeRaw;

  getNodeId(): number;
  setNodeId(value: number): BrokerNodeRaw;

  getNodeIp(): string;
  setNodeIp(value: string): BrokerNodeRaw;

  getNodeInnerAddr(): string;
  setNodeInnerAddr(value: string): BrokerNodeRaw;

  getStartTime(): number;
  setStartTime(value: number): BrokerNodeRaw;

  getRegisterTime(): number;
  setRegisterTime(value: number): BrokerNodeRaw;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BrokerNodeRaw.AsObject;
  static toObject(includeInstance: boolean, msg: BrokerNodeRaw): BrokerNodeRaw.AsObject;
  static serializeBinaryToWriter(message: BrokerNodeRaw, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BrokerNodeRaw;
  static deserializeBinaryFromReader(message: BrokerNodeRaw, reader: jspb.BinaryReader): BrokerNodeRaw;
}

export namespace BrokerNodeRaw {
  export type AsObject = {
    clusterName: string,
    clusterType: string,
    extendInfo: string,
    nodeId: number,
    nodeIp: string,
    nodeInnerAddr: string,
    startTime: number,
    registerTime: number,
  }
}

export class ClusterOverviewMetricsRequest extends jspb.Message {
  getStartTime(): number;
  setStartTime(value: number): ClusterOverviewMetricsRequest;

  getEndTime(): number;
  setEndTime(value: number): ClusterOverviewMetricsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClusterOverviewMetricsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ClusterOverviewMetricsRequest): ClusterOverviewMetricsRequest.AsObject;
  static serializeBinaryToWriter(message: ClusterOverviewMetricsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClusterOverviewMetricsRequest;
  static deserializeBinaryFromReader(message: ClusterOverviewMetricsRequest, reader: jspb.BinaryReader): ClusterOverviewMetricsRequest;
}

export namespace ClusterOverviewMetricsRequest {
  export type AsObject = {
    startTime: number,
    endTime: number,
  }
}

export class ClusterOverviewMetricsReply extends jspb.Message {
  getConnectionNum(): string;
  setConnectionNum(value: string): ClusterOverviewMetricsReply;

  getTopicNum(): string;
  setTopicNum(value: string): ClusterOverviewMetricsReply;

  getSubscribeNum(): string;
  setSubscribeNum(value: string): ClusterOverviewMetricsReply;

  getMessageInNum(): string;
  setMessageInNum(value: string): ClusterOverviewMetricsReply;

  getMessageOutNum(): string;
  setMessageOutNum(value: string): ClusterOverviewMetricsReply;

  getMessageDropNum(): string;
  setMessageDropNum(value: string): ClusterOverviewMetricsReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClusterOverviewMetricsReply.AsObject;
  static toObject(includeInstance: boolean, msg: ClusterOverviewMetricsReply): ClusterOverviewMetricsReply.AsObject;
  static serializeBinaryToWriter(message: ClusterOverviewMetricsReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClusterOverviewMetricsReply;
  static deserializeBinaryFromReader(message: ClusterOverviewMetricsReply, reader: jspb.BinaryReader): ClusterOverviewMetricsReply;
}

export namespace ClusterOverviewMetricsReply {
  export type AsObject = {
    connectionNum: string,
    topicNum: string,
    subscribeNum: string,
    messageInNum: string,
    messageOutNum: string,
    messageDropNum: string,
  }
}

export class ListClientRequest extends jspb.Message {
  getOptions(): QueryOptions | undefined;
  setOptions(value?: QueryOptions): ListClientRequest;
  hasOptions(): boolean;
  clearOptions(): ListClientRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListClientRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListClientRequest): ListClientRequest.AsObject;
  static serializeBinaryToWriter(message: ListClientRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListClientRequest;
  static deserializeBinaryFromReader(message: ListClientRequest, reader: jspb.BinaryReader): ListClientRequest;
}

export namespace ListClientRequest {
  export type AsObject = {
    options?: QueryOptions.AsObject,
  }

  export enum OptionsCase { 
    _OPTIONS_NOT_SET = 0,
    OPTIONS = 1,
  }
}

export class ListClientReply extends jspb.Message {
  getClientsList(): Array<ClientRaw>;
  setClientsList(value: Array<ClientRaw>): ListClientReply;
  clearClientsList(): ListClientReply;
  addClients(value?: ClientRaw, index?: number): ClientRaw;

  getTotalCount(): number;
  setTotalCount(value: number): ListClientReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListClientReply.AsObject;
  static toObject(includeInstance: boolean, msg: ListClientReply): ListClientReply.AsObject;
  static serializeBinaryToWriter(message: ListClientReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListClientReply;
  static deserializeBinaryFromReader(message: ListClientReply, reader: jspb.BinaryReader): ListClientReply;
}

export namespace ListClientReply {
  export type AsObject = {
    clientsList: Array<ClientRaw.AsObject>,
    totalCount: number,
  }
}

export class ClientRaw extends jspb.Message {
  getClientId(): string;
  setClientId(value: string): ClientRaw;

  getUsername(): string;
  setUsername(value: string): ClientRaw;

  getIsOnline(): boolean;
  setIsOnline(value: boolean): ClientRaw;

  getSourceIp(): string;
  setSourceIp(value: string): ClientRaw;

  getConnectedAt(): number;
  setConnectedAt(value: number): ClientRaw;

  getKeepAlive(): number;
  setKeepAlive(value: number): ClientRaw;

  getCleanSession(): boolean;
  setCleanSession(value: boolean): ClientRaw;

  getSessionExpiryInterval(): number;
  setSessionExpiryInterval(value: number): ClientRaw;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientRaw.AsObject;
  static toObject(includeInstance: boolean, msg: ClientRaw): ClientRaw.AsObject;
  static serializeBinaryToWriter(message: ClientRaw, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientRaw;
  static deserializeBinaryFromReader(message: ClientRaw, reader: jspb.BinaryReader): ClientRaw;
}

export namespace ClientRaw {
  export type AsObject = {
    clientId: string,
    username: string,
    isOnline: boolean,
    sourceIp: string,
    connectedAt: number,
    keepAlive: number,
    cleanSession: boolean,
    sessionExpiryInterval: number,
  }
}

export class ListSessionRequest extends jspb.Message {
  getOptions(): QueryOptions | undefined;
  setOptions(value?: QueryOptions): ListSessionRequest;
  hasOptions(): boolean;
  clearOptions(): ListSessionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListSessionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListSessionRequest): ListSessionRequest.AsObject;
  static serializeBinaryToWriter(message: ListSessionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListSessionRequest;
  static deserializeBinaryFromReader(message: ListSessionRequest, reader: jspb.BinaryReader): ListSessionRequest;
}

export namespace ListSessionRequest {
  export type AsObject = {
    options?: QueryOptions.AsObject,
  }

  export enum OptionsCase { 
    _OPTIONS_NOT_SET = 0,
    OPTIONS = 1,
  }
}

export class ListSessionReply extends jspb.Message {
  getSessionsList(): Array<SessionRaw>;
  setSessionsList(value: Array<SessionRaw>): ListSessionReply;
  clearSessionsList(): ListSessionReply;
  addSessions(value?: SessionRaw, index?: number): SessionRaw;

  getTotalCount(): number;
  setTotalCount(value: number): ListSessionReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListSessionReply.AsObject;
  static toObject(includeInstance: boolean, msg: ListSessionReply): ListSessionReply.AsObject;
  static serializeBinaryToWriter(message: ListSessionReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListSessionReply;
  static deserializeBinaryFromReader(message: ListSessionReply, reader: jspb.BinaryReader): ListSessionReply;
}

export namespace ListSessionReply {
  export type AsObject = {
    sessionsList: Array<SessionRaw.AsObject>,
    totalCount: number,
  }
}

export class SessionRaw extends jspb.Message {
  getClientId(): string;
  setClientId(value: string): SessionRaw;

  getSessionExpiry(): number;
  setSessionExpiry(value: number): SessionRaw;

  getIsContainLastWill(): boolean;
  setIsContainLastWill(value: boolean): SessionRaw;

  getLastWillDelayInterval(): number;
  setLastWillDelayInterval(value: number): SessionRaw;
  hasLastWillDelayInterval(): boolean;
  clearLastWillDelayInterval(): SessionRaw;

  getCreateTime(): number;
  setCreateTime(value: number): SessionRaw;

  getConnectionId(): number;
  setConnectionId(value: number): SessionRaw;
  hasConnectionId(): boolean;
  clearConnectionId(): SessionRaw;

  getBrokerId(): number;
  setBrokerId(value: number): SessionRaw;
  hasBrokerId(): boolean;
  clearBrokerId(): SessionRaw;

  getReconnectTime(): number;
  setReconnectTime(value: number): SessionRaw;
  hasReconnectTime(): boolean;
  clearReconnectTime(): SessionRaw;

  getDistinctTime(): number;
  setDistinctTime(value: number): SessionRaw;
  hasDistinctTime(): boolean;
  clearDistinctTime(): SessionRaw;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SessionRaw.AsObject;
  static toObject(includeInstance: boolean, msg: SessionRaw): SessionRaw.AsObject;
  static serializeBinaryToWriter(message: SessionRaw, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SessionRaw;
  static deserializeBinaryFromReader(message: SessionRaw, reader: jspb.BinaryReader): SessionRaw;
}

export namespace SessionRaw {
  export type AsObject = {
    clientId: string,
    sessionExpiry: number,
    isContainLastWill: boolean,
    lastWillDelayInterval?: number,
    createTime: number,
    connectionId?: number,
    brokerId?: number,
    reconnectTime?: number,
    distinctTime?: number,
  }

  export enum LastWillDelayIntervalCase { 
    _LAST_WILL_DELAY_INTERVAL_NOT_SET = 0,
    LAST_WILL_DELAY_INTERVAL = 4,
  }

  export enum ConnectionIdCase { 
    _CONNECTION_ID_NOT_SET = 0,
    CONNECTION_ID = 6,
  }

  export enum BrokerIdCase { 
    _BROKER_ID_NOT_SET = 0,
    BROKER_ID = 7,
  }

  export enum ReconnectTimeCase { 
    _RECONNECT_TIME_NOT_SET = 0,
    RECONNECT_TIME = 8,
  }

  export enum DistinctTimeCase { 
    _DISTINCT_TIME_NOT_SET = 0,
    DISTINCT_TIME = 9,
  }
}

export class ListUserRequest extends jspb.Message {
  getOptions(): QueryOptions | undefined;
  setOptions(value?: QueryOptions): ListUserRequest;
  hasOptions(): boolean;
  clearOptions(): ListUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListUserRequest): ListUserRequest.AsObject;
  static serializeBinaryToWriter(message: ListUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListUserRequest;
  static deserializeBinaryFromReader(message: ListUserRequest, reader: jspb.BinaryReader): ListUserRequest;
}

export namespace ListUserRequest {
  export type AsObject = {
    options?: QueryOptions.AsObject,
  }

  export enum OptionsCase { 
    _OPTIONS_NOT_SET = 0,
    OPTIONS = 1,
  }
}

export class ListUserReply extends jspb.Message {
  getUsersList(): Array<UserRaw>;
  setUsersList(value: Array<UserRaw>): ListUserReply;
  clearUsersList(): ListUserReply;
  addUsers(value?: UserRaw, index?: number): UserRaw;

  getTotalCount(): number;
  setTotalCount(value: number): ListUserReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListUserReply.AsObject;
  static toObject(includeInstance: boolean, msg: ListUserReply): ListUserReply.AsObject;
  static serializeBinaryToWriter(message: ListUserReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListUserReply;
  static deserializeBinaryFromReader(message: ListUserReply, reader: jspb.BinaryReader): ListUserReply;
}

export namespace ListUserReply {
  export type AsObject = {
    usersList: Array<UserRaw.AsObject>,
    totalCount: number,
  }
}

export class UserRaw extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): UserRaw;

  getIsSuperuser(): boolean;
  setIsSuperuser(value: boolean): UserRaw;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserRaw.AsObject;
  static toObject(includeInstance: boolean, msg: UserRaw): UserRaw.AsObject;
  static serializeBinaryToWriter(message: UserRaw, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserRaw;
  static deserializeBinaryFromReader(message: UserRaw, reader: jspb.BinaryReader): UserRaw;
}

export namespace UserRaw {
  export type AsObject = {
    username: string,
    isSuperuser: boolean,
  }
}

export class CreateUserRequest extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): CreateUserRequest;

  getPassword(): string;
  setPassword(value: string): CreateUserRequest;

  getIsSuperuser(): boolean;
  setIsSuperuser(value: boolean): CreateUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateUserRequest): CreateUserRequest.AsObject;
  static serializeBinaryToWriter(message: CreateUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateUserRequest;
  static deserializeBinaryFromReader(message: CreateUserRequest, reader: jspb.BinaryReader): CreateUserRequest;
}

export namespace CreateUserRequest {
  export type AsObject = {
    username: string,
    password: string,
    isSuperuser: boolean,
  }
}

export class CreateUserReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateUserReply.AsObject;
  static toObject(includeInstance: boolean, msg: CreateUserReply): CreateUserReply.AsObject;
  static serializeBinaryToWriter(message: CreateUserReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateUserReply;
  static deserializeBinaryFromReader(message: CreateUserReply, reader: jspb.BinaryReader): CreateUserReply;
}

export namespace CreateUserReply {
  export type AsObject = {
  }
}

export class DeleteUserRequest extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): DeleteUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteUserRequest): DeleteUserRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteUserRequest;
  static deserializeBinaryFromReader(message: DeleteUserRequest, reader: jspb.BinaryReader): DeleteUserRequest;
}

export namespace DeleteUserRequest {
  export type AsObject = {
    username: string,
  }
}

export class DeleteUserReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteUserReply.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteUserReply): DeleteUserReply.AsObject;
  static serializeBinaryToWriter(message: DeleteUserReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteUserReply;
  static deserializeBinaryFromReader(message: DeleteUserReply, reader: jspb.BinaryReader): DeleteUserReply;
}

export namespace DeleteUserReply {
  export type AsObject = {
  }
}

export class ListAclRequest extends jspb.Message {
  getClusterName(): string;
  setClusterName(value: string): ListAclRequest;

  getOptions(): QueryOptions | undefined;
  setOptions(value?: QueryOptions): ListAclRequest;
  hasOptions(): boolean;
  clearOptions(): ListAclRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAclRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListAclRequest): ListAclRequest.AsObject;
  static serializeBinaryToWriter(message: ListAclRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAclRequest;
  static deserializeBinaryFromReader(message: ListAclRequest, reader: jspb.BinaryReader): ListAclRequest;
}

export namespace ListAclRequest {
  export type AsObject = {
    clusterName: string,
    options?: QueryOptions.AsObject,
  }

  export enum OptionsCase { 
    _OPTIONS_NOT_SET = 0,
    OPTIONS = 2,
  }
}

export class ListAclReply extends jspb.Message {
  getAclsList(): Array<Uint8Array | string>;
  setAclsList(value: Array<Uint8Array | string>): ListAclReply;
  clearAclsList(): ListAclReply;
  addAcls(value: Uint8Array | string, index?: number): ListAclReply;

  getTotalCount(): number;
  setTotalCount(value: number): ListAclReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAclReply.AsObject;
  static toObject(includeInstance: boolean, msg: ListAclReply): ListAclReply.AsObject;
  static serializeBinaryToWriter(message: ListAclReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAclReply;
  static deserializeBinaryFromReader(message: ListAclReply, reader: jspb.BinaryReader): ListAclReply;
}

export namespace ListAclReply {
  export type AsObject = {
    aclsList: Array<Uint8Array | string>,
    totalCount: number,
  }
}

export class DeleteAclRequest extends jspb.Message {
  getClusterName(): string;
  setClusterName(value: string): DeleteAclRequest;

  getAcl(): Uint8Array | string;
  getAcl_asU8(): Uint8Array;
  getAcl_asB64(): string;
  setAcl(value: Uint8Array | string): DeleteAclRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteAclRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteAclRequest): DeleteAclRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteAclRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteAclRequest;
  static deserializeBinaryFromReader(message: DeleteAclRequest, reader: jspb.BinaryReader): DeleteAclRequest;
}

export namespace DeleteAclRequest {
  export type AsObject = {
    clusterName: string,
    acl: Uint8Array | string,
  }
}

export class DeleteAclReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteAclReply.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteAclReply): DeleteAclReply.AsObject;
  static serializeBinaryToWriter(message: DeleteAclReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteAclReply;
  static deserializeBinaryFromReader(message: DeleteAclReply, reader: jspb.BinaryReader): DeleteAclReply;
}

export namespace DeleteAclReply {
  export type AsObject = {
  }
}

export class CreateAclRequest extends jspb.Message {
  getClusterName(): string;
  setClusterName(value: string): CreateAclRequest;

  getAcl(): Uint8Array | string;
  getAcl_asU8(): Uint8Array;
  getAcl_asB64(): string;
  setAcl(value: Uint8Array | string): CreateAclRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateAclRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateAclRequest): CreateAclRequest.AsObject;
  static serializeBinaryToWriter(message: CreateAclRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateAclRequest;
  static deserializeBinaryFromReader(message: CreateAclRequest, reader: jspb.BinaryReader): CreateAclRequest;
}

export namespace CreateAclRequest {
  export type AsObject = {
    clusterName: string,
    acl: Uint8Array | string,
  }
}

export class CreateAclReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateAclReply.AsObject;
  static toObject(includeInstance: boolean, msg: CreateAclReply): CreateAclReply.AsObject;
  static serializeBinaryToWriter(message: CreateAclReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateAclReply;
  static deserializeBinaryFromReader(message: CreateAclReply, reader: jspb.BinaryReader): CreateAclReply;
}

export namespace CreateAclReply {
  export type AsObject = {
  }
}

export class ListBlacklistRequest extends jspb.Message {
  getClusterName(): string;
  setClusterName(value: string): ListBlacklistRequest;

  getOptions(): QueryOptions | undefined;
  setOptions(value?: QueryOptions): ListBlacklistRequest;
  hasOptions(): boolean;
  clearOptions(): ListBlacklistRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListBlacklistRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListBlacklistRequest): ListBlacklistRequest.AsObject;
  static serializeBinaryToWriter(message: ListBlacklistRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListBlacklistRequest;
  static deserializeBinaryFromReader(message: ListBlacklistRequest, reader: jspb.BinaryReader): ListBlacklistRequest;
}

export namespace ListBlacklistRequest {
  export type AsObject = {
    clusterName: string,
    options?: QueryOptions.AsObject,
  }

  export enum OptionsCase { 
    _OPTIONS_NOT_SET = 0,
    OPTIONS = 2,
  }
}

export class ListBlacklistReply extends jspb.Message {
  getBlacklistsList(): Array<BlacklistRaw>;
  setBlacklistsList(value: Array<BlacklistRaw>): ListBlacklistReply;
  clearBlacklistsList(): ListBlacklistReply;
  addBlacklists(value?: BlacklistRaw, index?: number): BlacklistRaw;

  getTotalCount(): number;
  setTotalCount(value: number): ListBlacklistReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListBlacklistReply.AsObject;
  static toObject(includeInstance: boolean, msg: ListBlacklistReply): ListBlacklistReply.AsObject;
  static serializeBinaryToWriter(message: ListBlacklistReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListBlacklistReply;
  static deserializeBinaryFromReader(message: ListBlacklistReply, reader: jspb.BinaryReader): ListBlacklistReply;
}

export namespace ListBlacklistReply {
  export type AsObject = {
    blacklistsList: Array<BlacklistRaw.AsObject>,
    totalCount: number,
  }
}

export class BlacklistRaw extends jspb.Message {
  getBlacklistType(): BlacklistType;
  setBlacklistType(value: BlacklistType): BlacklistRaw;

  getResourceName(): string;
  setResourceName(value: string): BlacklistRaw;

  getEndTime(): number;
  setEndTime(value: number): BlacklistRaw;

  getDesc(): string;
  setDesc(value: string): BlacklistRaw;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlacklistRaw.AsObject;
  static toObject(includeInstance: boolean, msg: BlacklistRaw): BlacklistRaw.AsObject;
  static serializeBinaryToWriter(message: BlacklistRaw, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlacklistRaw;
  static deserializeBinaryFromReader(message: BlacklistRaw, reader: jspb.BinaryReader): BlacklistRaw;
}

export namespace BlacklistRaw {
  export type AsObject = {
    blacklistType: BlacklistType,
    resourceName: string,
    endTime: number,
    desc: string,
  }
}

export class CreateBlacklistRequest extends jspb.Message {
  getClusterName(): string;
  setClusterName(value: string): CreateBlacklistRequest;

  getBlacklist(): Uint8Array | string;
  getBlacklist_asU8(): Uint8Array;
  getBlacklist_asB64(): string;
  setBlacklist(value: Uint8Array | string): CreateBlacklistRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateBlacklistRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateBlacklistRequest): CreateBlacklistRequest.AsObject;
  static serializeBinaryToWriter(message: CreateBlacklistRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateBlacklistRequest;
  static deserializeBinaryFromReader(message: CreateBlacklistRequest, reader: jspb.BinaryReader): CreateBlacklistRequest;
}

export namespace CreateBlacklistRequest {
  export type AsObject = {
    clusterName: string,
    blacklist: Uint8Array | string,
  }
}

export class CreateBlacklistReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateBlacklistReply.AsObject;
  static toObject(includeInstance: boolean, msg: CreateBlacklistReply): CreateBlacklistReply.AsObject;
  static serializeBinaryToWriter(message: CreateBlacklistReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateBlacklistReply;
  static deserializeBinaryFromReader(message: CreateBlacklistReply, reader: jspb.BinaryReader): CreateBlacklistReply;
}

export namespace CreateBlacklistReply {
  export type AsObject = {
  }
}

export class DeleteBlacklistRequest extends jspb.Message {
  getClusterName(): string;
  setClusterName(value: string): DeleteBlacklistRequest;

  getBlacklistType(): string;
  setBlacklistType(value: string): DeleteBlacklistRequest;

  getResourceName(): string;
  setResourceName(value: string): DeleteBlacklistRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteBlacklistRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteBlacklistRequest): DeleteBlacklistRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteBlacklistRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteBlacklistRequest;
  static deserializeBinaryFromReader(message: DeleteBlacklistRequest, reader: jspb.BinaryReader): DeleteBlacklistRequest;
}

export namespace DeleteBlacklistRequest {
  export type AsObject = {
    clusterName: string,
    blacklistType: string,
    resourceName: string,
  }
}

export class DeleteBlacklistReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteBlacklistReply.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteBlacklistReply): DeleteBlacklistReply.AsObject;
  static serializeBinaryToWriter(message: DeleteBlacklistReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteBlacklistReply;
  static deserializeBinaryFromReader(message: DeleteBlacklistReply, reader: jspb.BinaryReader): DeleteBlacklistReply;
}

export namespace DeleteBlacklistReply {
  export type AsObject = {
  }
}

export class ListConnectionRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListConnectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListConnectionRequest): ListConnectionRequest.AsObject;
  static serializeBinaryToWriter(message: ListConnectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListConnectionRequest;
  static deserializeBinaryFromReader(message: ListConnectionRequest, reader: jspb.BinaryReader): ListConnectionRequest;
}

export namespace ListConnectionRequest {
  export type AsObject = {
  }
}

export class ListConnectionReply extends jspb.Message {
  getListConnectionRawList(): Array<ListConnectionRaw>;
  setListConnectionRawList(value: Array<ListConnectionRaw>): ListConnectionReply;
  clearListConnectionRawList(): ListConnectionReply;
  addListConnectionRaw(value?: ListConnectionRaw, index?: number): ListConnectionRaw;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListConnectionReply.AsObject;
  static toObject(includeInstance: boolean, msg: ListConnectionReply): ListConnectionReply.AsObject;
  static serializeBinaryToWriter(message: ListConnectionReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListConnectionReply;
  static deserializeBinaryFromReader(message: ListConnectionReply, reader: jspb.BinaryReader): ListConnectionReply;
}

export namespace ListConnectionReply {
  export type AsObject = {
    listConnectionRawList: Array<ListConnectionRaw.AsObject>,
  }
}

export class ListConnectionRaw extends jspb.Message {
  getConnectionId(): number;
  setConnectionId(value: number): ListConnectionRaw;

  getConnectionType(): string;
  setConnectionType(value: string): ListConnectionRaw;

  getProtocol(): string;
  setProtocol(value: string): ListConnectionRaw;

  getSourceAddr(): string;
  setSourceAddr(value: string): ListConnectionRaw;

  getInfo(): string;
  setInfo(value: string): ListConnectionRaw;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListConnectionRaw.AsObject;
  static toObject(includeInstance: boolean, msg: ListConnectionRaw): ListConnectionRaw.AsObject;
  static serializeBinaryToWriter(message: ListConnectionRaw, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListConnectionRaw;
  static deserializeBinaryFromReader(message: ListConnectionRaw, reader: jspb.BinaryReader): ListConnectionRaw;
}

export namespace ListConnectionRaw {
  export type AsObject = {
    connectionId: number,
    connectionType: string,
    protocol: string,
    sourceAddr: string,
    info: string,
  }
}

export class EnableFlappingDetectRequest extends jspb.Message {
  getIsEnable(): boolean;
  setIsEnable(value: boolean): EnableFlappingDetectRequest;

  getWindowTime(): number;
  setWindowTime(value: number): EnableFlappingDetectRequest;

  getMaxClientConnections(): number;
  setMaxClientConnections(value: number): EnableFlappingDetectRequest;

  getBanTime(): number;
  setBanTime(value: number): EnableFlappingDetectRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnableFlappingDetectRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EnableFlappingDetectRequest): EnableFlappingDetectRequest.AsObject;
  static serializeBinaryToWriter(message: EnableFlappingDetectRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnableFlappingDetectRequest;
  static deserializeBinaryFromReader(message: EnableFlappingDetectRequest, reader: jspb.BinaryReader): EnableFlappingDetectRequest;
}

export namespace EnableFlappingDetectRequest {
  export type AsObject = {
    isEnable: boolean,
    windowTime: number,
    maxClientConnections: number,
    banTime: number,
  }
}

export class EnableFlappingDetectReply extends jspb.Message {
  getIsEnable(): boolean;
  setIsEnable(value: boolean): EnableFlappingDetectReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnableFlappingDetectReply.AsObject;
  static toObject(includeInstance: boolean, msg: EnableFlappingDetectReply): EnableFlappingDetectReply.AsObject;
  static serializeBinaryToWriter(message: EnableFlappingDetectReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnableFlappingDetectReply;
  static deserializeBinaryFromReader(message: EnableFlappingDetectReply, reader: jspb.BinaryReader): EnableFlappingDetectReply;
}

export namespace EnableFlappingDetectReply {
  export type AsObject = {
    isEnable: boolean,
  }
}

export class ListSlowSubscribeRequest extends jspb.Message {
  getList(): number;
  setList(value: number): ListSlowSubscribeRequest;

  getTopic(): string;
  setTopic(value: string): ListSlowSubscribeRequest;

  getSubName(): string;
  setSubName(value: string): ListSlowSubscribeRequest;

  getClientId(): string;
  setClientId(value: string): ListSlowSubscribeRequest;

  getSort(): string;
  setSort(value: string): ListSlowSubscribeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListSlowSubscribeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListSlowSubscribeRequest): ListSlowSubscribeRequest.AsObject;
  static serializeBinaryToWriter(message: ListSlowSubscribeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListSlowSubscribeRequest;
  static deserializeBinaryFromReader(message: ListSlowSubscribeRequest, reader: jspb.BinaryReader): ListSlowSubscribeRequest;
}

export namespace ListSlowSubscribeRequest {
  export type AsObject = {
    list: number,
    topic: string,
    subName: string,
    clientId: string,
    sort: string,
  }
}

export class ListSlowSubscribeReply extends jspb.Message {
  getListSlowSubscribeRawList(): Array<ListSlowSubScribeRaw>;
  setListSlowSubscribeRawList(value: Array<ListSlowSubScribeRaw>): ListSlowSubscribeReply;
  clearListSlowSubscribeRawList(): ListSlowSubscribeReply;
  addListSlowSubscribeRaw(value?: ListSlowSubScribeRaw, index?: number): ListSlowSubScribeRaw;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListSlowSubscribeReply.AsObject;
  static toObject(includeInstance: boolean, msg: ListSlowSubscribeReply): ListSlowSubscribeReply.AsObject;
  static serializeBinaryToWriter(message: ListSlowSubscribeReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListSlowSubscribeReply;
  static deserializeBinaryFromReader(message: ListSlowSubscribeReply, reader: jspb.BinaryReader): ListSlowSubscribeReply;
}

export namespace ListSlowSubscribeReply {
  export type AsObject = {
    listSlowSubscribeRawList: Array<ListSlowSubScribeRaw.AsObject>,
  }
}

export class ListSlowSubScribeRaw extends jspb.Message {
  getClientId(): string;
  setClientId(value: string): ListSlowSubScribeRaw;

  getTopic(): string;
  setTopic(value: string): ListSlowSubScribeRaw;

  getTimeMs(): number;
  setTimeMs(value: number): ListSlowSubScribeRaw;

  getNodeInfo(): string;
  setNodeInfo(value: string): ListSlowSubScribeRaw;

  getCreateTime(): number;
  setCreateTime(value: number): ListSlowSubScribeRaw;

  getSubName(): string;
  setSubName(value: string): ListSlowSubScribeRaw;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListSlowSubScribeRaw.AsObject;
  static toObject(includeInstance: boolean, msg: ListSlowSubScribeRaw): ListSlowSubScribeRaw.AsObject;
  static serializeBinaryToWriter(message: ListSlowSubScribeRaw, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListSlowSubScribeRaw;
  static deserializeBinaryFromReader(message: ListSlowSubScribeRaw, reader: jspb.BinaryReader): ListSlowSubScribeRaw;
}

export namespace ListSlowSubScribeRaw {
  export type AsObject = {
    clientId: string,
    topic: string,
    timeMs: number,
    nodeInfo: string,
    createTime: number,
    subName: string,
  }
}

export class SetSystemAlarmConfigRequest extends jspb.Message {
  getEnable(): boolean;
  setEnable(value: boolean): SetSystemAlarmConfigRequest;
  hasEnable(): boolean;
  clearEnable(): SetSystemAlarmConfigRequest;

  getOsCpuHighWatermark(): number;
  setOsCpuHighWatermark(value: number): SetSystemAlarmConfigRequest;
  hasOsCpuHighWatermark(): boolean;
  clearOsCpuHighWatermark(): SetSystemAlarmConfigRequest;

  getOsCpuLowWatermark(): number;
  setOsCpuLowWatermark(value: number): SetSystemAlarmConfigRequest;
  hasOsCpuLowWatermark(): boolean;
  clearOsCpuLowWatermark(): SetSystemAlarmConfigRequest;

  getOsMemoryHighWatermark(): number;
  setOsMemoryHighWatermark(value: number): SetSystemAlarmConfigRequest;
  hasOsMemoryHighWatermark(): boolean;
  clearOsMemoryHighWatermark(): SetSystemAlarmConfigRequest;

  getOsCpuCheckIntervalMs(): number;
  setOsCpuCheckIntervalMs(value: number): SetSystemAlarmConfigRequest;
  hasOsCpuCheckIntervalMs(): boolean;
  clearOsCpuCheckIntervalMs(): SetSystemAlarmConfigRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetSystemAlarmConfigRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetSystemAlarmConfigRequest): SetSystemAlarmConfigRequest.AsObject;
  static serializeBinaryToWriter(message: SetSystemAlarmConfigRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetSystemAlarmConfigRequest;
  static deserializeBinaryFromReader(message: SetSystemAlarmConfigRequest, reader: jspb.BinaryReader): SetSystemAlarmConfigRequest;
}

export namespace SetSystemAlarmConfigRequest {
  export type AsObject = {
    enable?: boolean,
    osCpuHighWatermark?: number,
    osCpuLowWatermark?: number,
    osMemoryHighWatermark?: number,
    osCpuCheckIntervalMs?: number,
  }

  export enum EnableCase { 
    _ENABLE_NOT_SET = 0,
    ENABLE = 1,
  }

  export enum OsCpuHighWatermarkCase { 
    _OS_CPU_HIGH_WATERMARK_NOT_SET = 0,
    OS_CPU_HIGH_WATERMARK = 2,
  }

  export enum OsCpuLowWatermarkCase { 
    _OS_CPU_LOW_WATERMARK_NOT_SET = 0,
    OS_CPU_LOW_WATERMARK = 3,
  }

  export enum OsMemoryHighWatermarkCase { 
    _OS_MEMORY_HIGH_WATERMARK_NOT_SET = 0,
    OS_MEMORY_HIGH_WATERMARK = 4,
  }

  export enum OsCpuCheckIntervalMsCase { 
    _OS_CPU_CHECK_INTERVAL_MS_NOT_SET = 0,
    OS_CPU_CHECK_INTERVAL_MS = 5,
  }
}

export class SetSystemAlarmConfigReply extends jspb.Message {
  getEnable(): boolean;
  setEnable(value: boolean): SetSystemAlarmConfigReply;

  getOsCpuHighWatermark(): number;
  setOsCpuHighWatermark(value: number): SetSystemAlarmConfigReply;
  hasOsCpuHighWatermark(): boolean;
  clearOsCpuHighWatermark(): SetSystemAlarmConfigReply;

  getOsCpuLowWatermark(): number;
  setOsCpuLowWatermark(value: number): SetSystemAlarmConfigReply;
  hasOsCpuLowWatermark(): boolean;
  clearOsCpuLowWatermark(): SetSystemAlarmConfigReply;

  getOsMemoryHighWatermark(): number;
  setOsMemoryHighWatermark(value: number): SetSystemAlarmConfigReply;
  hasOsMemoryHighWatermark(): boolean;
  clearOsMemoryHighWatermark(): SetSystemAlarmConfigReply;

  getOsCpuCheckIntervalMs(): number;
  setOsCpuCheckIntervalMs(value: number): SetSystemAlarmConfigReply;
  hasOsCpuCheckIntervalMs(): boolean;
  clearOsCpuCheckIntervalMs(): SetSystemAlarmConfigReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetSystemAlarmConfigReply.AsObject;
  static toObject(includeInstance: boolean, msg: SetSystemAlarmConfigReply): SetSystemAlarmConfigReply.AsObject;
  static serializeBinaryToWriter(message: SetSystemAlarmConfigReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetSystemAlarmConfigReply;
  static deserializeBinaryFromReader(message: SetSystemAlarmConfigReply, reader: jspb.BinaryReader): SetSystemAlarmConfigReply;
}

export namespace SetSystemAlarmConfigReply {
  export type AsObject = {
    enable: boolean,
    osCpuHighWatermark?: number,
    osCpuLowWatermark?: number,
    osMemoryHighWatermark?: number,
    osCpuCheckIntervalMs?: number,
  }

  export enum OsCpuHighWatermarkCase { 
    _OS_CPU_HIGH_WATERMARK_NOT_SET = 0,
    OS_CPU_HIGH_WATERMARK = 2,
  }

  export enum OsCpuLowWatermarkCase { 
    _OS_CPU_LOW_WATERMARK_NOT_SET = 0,
    OS_CPU_LOW_WATERMARK = 3,
  }

  export enum OsMemoryHighWatermarkCase { 
    _OS_MEMORY_HIGH_WATERMARK_NOT_SET = 0,
    OS_MEMORY_HIGH_WATERMARK = 4,
  }

  export enum OsCpuCheckIntervalMsCase { 
    _OS_CPU_CHECK_INTERVAL_MS_NOT_SET = 0,
    OS_CPU_CHECK_INTERVAL_MS = 5,
  }
}

export class ListSystemAlarmRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListSystemAlarmRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListSystemAlarmRequest): ListSystemAlarmRequest.AsObject;
  static serializeBinaryToWriter(message: ListSystemAlarmRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListSystemAlarmRequest;
  static deserializeBinaryFromReader(message: ListSystemAlarmRequest, reader: jspb.BinaryReader): ListSystemAlarmRequest;
}

export namespace ListSystemAlarmRequest {
  export type AsObject = {
  }
}

export class ListSystemAlarmReply extends jspb.Message {
  getListSystemAlarmRawList(): Array<ListSystemAlarmRaw>;
  setListSystemAlarmRawList(value: Array<ListSystemAlarmRaw>): ListSystemAlarmReply;
  clearListSystemAlarmRawList(): ListSystemAlarmReply;
  addListSystemAlarmRaw(value?: ListSystemAlarmRaw, index?: number): ListSystemAlarmRaw;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListSystemAlarmReply.AsObject;
  static toObject(includeInstance: boolean, msg: ListSystemAlarmReply): ListSystemAlarmReply.AsObject;
  static serializeBinaryToWriter(message: ListSystemAlarmReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListSystemAlarmReply;
  static deserializeBinaryFromReader(message: ListSystemAlarmReply, reader: jspb.BinaryReader): ListSystemAlarmReply;
}

export namespace ListSystemAlarmReply {
  export type AsObject = {
    listSystemAlarmRawList: Array<ListSystemAlarmRaw.AsObject>,
  }
}

export class ListSystemAlarmRaw extends jspb.Message {
  getName(): string;
  setName(value: string): ListSystemAlarmRaw;

  getMessage(): string;
  setMessage(value: string): ListSystemAlarmRaw;

  getActivateAt(): number;
  setActivateAt(value: number): ListSystemAlarmRaw;

  getActivated(): boolean;
  setActivated(value: boolean): ListSystemAlarmRaw;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListSystemAlarmRaw.AsObject;
  static toObject(includeInstance: boolean, msg: ListSystemAlarmRaw): ListSystemAlarmRaw.AsObject;
  static serializeBinaryToWriter(message: ListSystemAlarmRaw, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListSystemAlarmRaw;
  static deserializeBinaryFromReader(message: ListSystemAlarmRaw, reader: jspb.BinaryReader): ListSystemAlarmRaw;
}

export namespace ListSystemAlarmRaw {
  export type AsObject = {
    name: string,
    message: string,
    activateAt: number,
    activated: boolean,
  }
}

export class ListTopicRequest extends jspb.Message {
  getTopicName(): string;
  setTopicName(value: string): ListTopicRequest;
  hasTopicName(): boolean;
  clearTopicName(): ListTopicRequest;

  getOptions(): QueryOptions | undefined;
  setOptions(value?: QueryOptions): ListTopicRequest;
  hasOptions(): boolean;
  clearOptions(): ListTopicRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListTopicRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListTopicRequest): ListTopicRequest.AsObject;
  static serializeBinaryToWriter(message: ListTopicRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListTopicRequest;
  static deserializeBinaryFromReader(message: ListTopicRequest, reader: jspb.BinaryReader): ListTopicRequest;
}

export namespace ListTopicRequest {
  export type AsObject = {
    topicName?: string,
    options?: QueryOptions.AsObject,
  }

  export enum TopicNameCase { 
    _TOPIC_NAME_NOT_SET = 0,
    TOPIC_NAME = 1,
  }

  export enum OptionsCase { 
    _OPTIONS_NOT_SET = 0,
    OPTIONS = 2,
  }
}

export class ListTopicReply extends jspb.Message {
  getTopicsList(): Array<MqttTopicRaw>;
  setTopicsList(value: Array<MqttTopicRaw>): ListTopicReply;
  clearTopicsList(): ListTopicReply;
  addTopics(value?: MqttTopicRaw, index?: number): MqttTopicRaw;

  getTotalCount(): number;
  setTotalCount(value: number): ListTopicReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListTopicReply.AsObject;
  static toObject(includeInstance: boolean, msg: ListTopicReply): ListTopicReply.AsObject;
  static serializeBinaryToWriter(message: ListTopicReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListTopicReply;
  static deserializeBinaryFromReader(message: ListTopicReply, reader: jspb.BinaryReader): ListTopicReply;
}

export namespace ListTopicReply {
  export type AsObject = {
    topicsList: Array<MqttTopicRaw.AsObject>,
    totalCount: number,
  }
}

export class MqttTopicRaw extends jspb.Message {
  getTopicId(): string;
  setTopicId(value: string): MqttTopicRaw;

  getClusterName(): string;
  setClusterName(value: string): MqttTopicRaw;

  getTopicName(): string;
  setTopicName(value: string): MqttTopicRaw;

  getIsContainRetainMessage(): boolean;
  setIsContainRetainMessage(value: boolean): MqttTopicRaw;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttTopicRaw.AsObject;
  static toObject(includeInstance: boolean, msg: MqttTopicRaw): MqttTopicRaw.AsObject;
  static serializeBinaryToWriter(message: MqttTopicRaw, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttTopicRaw;
  static deserializeBinaryFromReader(message: MqttTopicRaw, reader: jspb.BinaryReader): MqttTopicRaw;
}

export namespace MqttTopicRaw {
  export type AsObject = {
    topicId: string,
    clusterName: string,
    topicName: string,
    isContainRetainMessage: boolean,
  }
}

export class DeleteTopicRewriteRuleRequest extends jspb.Message {
  getAction(): string;
  setAction(value: string): DeleteTopicRewriteRuleRequest;

  getSourceTopic(): string;
  setSourceTopic(value: string): DeleteTopicRewriteRuleRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteTopicRewriteRuleRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteTopicRewriteRuleRequest): DeleteTopicRewriteRuleRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteTopicRewriteRuleRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteTopicRewriteRuleRequest;
  static deserializeBinaryFromReader(message: DeleteTopicRewriteRuleRequest, reader: jspb.BinaryReader): DeleteTopicRewriteRuleRequest;
}

export namespace DeleteTopicRewriteRuleRequest {
  export type AsObject = {
    action: string,
    sourceTopic: string,
  }
}

export class DeleteTopicRewriteRuleReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteTopicRewriteRuleReply.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteTopicRewriteRuleReply): DeleteTopicRewriteRuleReply.AsObject;
  static serializeBinaryToWriter(message: DeleteTopicRewriteRuleReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteTopicRewriteRuleReply;
  static deserializeBinaryFromReader(message: DeleteTopicRewriteRuleReply, reader: jspb.BinaryReader): DeleteTopicRewriteRuleReply;
}

export namespace DeleteTopicRewriteRuleReply {
  export type AsObject = {
  }
}

export class CreateTopicRewriteRuleRequest extends jspb.Message {
  getAction(): string;
  setAction(value: string): CreateTopicRewriteRuleRequest;

  getSourceTopic(): string;
  setSourceTopic(value: string): CreateTopicRewriteRuleRequest;

  getDestTopic(): string;
  setDestTopic(value: string): CreateTopicRewriteRuleRequest;

  getRegex(): string;
  setRegex(value: string): CreateTopicRewriteRuleRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateTopicRewriteRuleRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateTopicRewriteRuleRequest): CreateTopicRewriteRuleRequest.AsObject;
  static serializeBinaryToWriter(message: CreateTopicRewriteRuleRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateTopicRewriteRuleRequest;
  static deserializeBinaryFromReader(message: CreateTopicRewriteRuleRequest, reader: jspb.BinaryReader): CreateTopicRewriteRuleRequest;
}

export namespace CreateTopicRewriteRuleRequest {
  export type AsObject = {
    action: string,
    sourceTopic: string,
    destTopic: string,
    regex: string,
  }
}

export class CreateTopicRewriteRuleReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateTopicRewriteRuleReply.AsObject;
  static toObject(includeInstance: boolean, msg: CreateTopicRewriteRuleReply): CreateTopicRewriteRuleReply.AsObject;
  static serializeBinaryToWriter(message: CreateTopicRewriteRuleReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateTopicRewriteRuleReply;
  static deserializeBinaryFromReader(message: CreateTopicRewriteRuleReply, reader: jspb.BinaryReader): CreateTopicRewriteRuleReply;
}

export namespace CreateTopicRewriteRuleReply {
  export type AsObject = {
  }
}

export class ListRewriteTopicRuleRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListRewriteTopicRuleRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListRewriteTopicRuleRequest): ListRewriteTopicRuleRequest.AsObject;
  static serializeBinaryToWriter(message: ListRewriteTopicRuleRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListRewriteTopicRuleRequest;
  static deserializeBinaryFromReader(message: ListRewriteTopicRuleRequest, reader: jspb.BinaryReader): ListRewriteTopicRuleRequest;
}

export namespace ListRewriteTopicRuleRequest {
  export type AsObject = {
  }
}

export class ListRewriteTopicRuleReply extends jspb.Message {
  getRewriteTopicRulesList(): Array<MqttTopicRewriteRuleRaw>;
  setRewriteTopicRulesList(value: Array<MqttTopicRewriteRuleRaw>): ListRewriteTopicRuleReply;
  clearRewriteTopicRulesList(): ListRewriteTopicRuleReply;
  addRewriteTopicRules(value?: MqttTopicRewriteRuleRaw, index?: number): MqttTopicRewriteRuleRaw;

  getTotalCount(): number;
  setTotalCount(value: number): ListRewriteTopicRuleReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListRewriteTopicRuleReply.AsObject;
  static toObject(includeInstance: boolean, msg: ListRewriteTopicRuleReply): ListRewriteTopicRuleReply.AsObject;
  static serializeBinaryToWriter(message: ListRewriteTopicRuleReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListRewriteTopicRuleReply;
  static deserializeBinaryFromReader(message: ListRewriteTopicRuleReply, reader: jspb.BinaryReader): ListRewriteTopicRuleReply;
}

export namespace ListRewriteTopicRuleReply {
  export type AsObject = {
    rewriteTopicRulesList: Array<MqttTopicRewriteRuleRaw.AsObject>,
    totalCount: number,
  }
}

export class MqttTopicRewriteRuleRaw extends jspb.Message {
  getSourceTopic(): string;
  setSourceTopic(value: string): MqttTopicRewriteRuleRaw;

  getClusterName(): string;
  setClusterName(value: string): MqttTopicRewriteRuleRaw;

  getDestTopic(): string;
  setDestTopic(value: string): MqttTopicRewriteRuleRaw;

  getAction(): string;
  setAction(value: string): MqttTopicRewriteRuleRaw;

  getRegex(): string;
  setRegex(value: string): MqttTopicRewriteRuleRaw;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttTopicRewriteRuleRaw.AsObject;
  static toObject(includeInstance: boolean, msg: MqttTopicRewriteRuleRaw): MqttTopicRewriteRuleRaw.AsObject;
  static serializeBinaryToWriter(message: MqttTopicRewriteRuleRaw, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttTopicRewriteRuleRaw;
  static deserializeBinaryFromReader(message: MqttTopicRewriteRuleRaw, reader: jspb.BinaryReader): MqttTopicRewriteRuleRaw;
}

export namespace MqttTopicRewriteRuleRaw {
  export type AsObject = {
    sourceTopic: string,
    clusterName: string,
    destTopic: string,
    action: string,
    regex: string,
  }
}

export class MqttListConnectorRequest extends jspb.Message {
  getConnectorName(): string;
  setConnectorName(value: string): MqttListConnectorRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttListConnectorRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MqttListConnectorRequest): MqttListConnectorRequest.AsObject;
  static serializeBinaryToWriter(message: MqttListConnectorRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttListConnectorRequest;
  static deserializeBinaryFromReader(message: MqttListConnectorRequest, reader: jspb.BinaryReader): MqttListConnectorRequest;
}

export namespace MqttListConnectorRequest {
  export type AsObject = {
    connectorName: string,
  }
}

export class MqttListConnectorReply extends jspb.Message {
  getConnectorsList(): Array<Uint8Array | string>;
  setConnectorsList(value: Array<Uint8Array | string>): MqttListConnectorReply;
  clearConnectorsList(): MqttListConnectorReply;
  addConnectors(value: Uint8Array | string, index?: number): MqttListConnectorReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttListConnectorReply.AsObject;
  static toObject(includeInstance: boolean, msg: MqttListConnectorReply): MqttListConnectorReply.AsObject;
  static serializeBinaryToWriter(message: MqttListConnectorReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttListConnectorReply;
  static deserializeBinaryFromReader(message: MqttListConnectorReply, reader: jspb.BinaryReader): MqttListConnectorReply;
}

export namespace MqttListConnectorReply {
  export type AsObject = {
    connectorsList: Array<Uint8Array | string>,
  }
}

export class MqttCreateConnectorRequest extends jspb.Message {
  getConnectorName(): string;
  setConnectorName(value: string): MqttCreateConnectorRequest;

  getConnectorType(): MqttConnectorType;
  setConnectorType(value: MqttConnectorType): MqttCreateConnectorRequest;

  getConfig(): string;
  setConfig(value: string): MqttCreateConnectorRequest;

  getTopicId(): string;
  setTopicId(value: string): MqttCreateConnectorRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttCreateConnectorRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MqttCreateConnectorRequest): MqttCreateConnectorRequest.AsObject;
  static serializeBinaryToWriter(message: MqttCreateConnectorRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttCreateConnectorRequest;
  static deserializeBinaryFromReader(message: MqttCreateConnectorRequest, reader: jspb.BinaryReader): MqttCreateConnectorRequest;
}

export namespace MqttCreateConnectorRequest {
  export type AsObject = {
    connectorName: string,
    connectorType: MqttConnectorType,
    config: string,
    topicId: string,
  }
}

export class MqttCreateConnectorReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttCreateConnectorReply.AsObject;
  static toObject(includeInstance: boolean, msg: MqttCreateConnectorReply): MqttCreateConnectorReply.AsObject;
  static serializeBinaryToWriter(message: MqttCreateConnectorReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttCreateConnectorReply;
  static deserializeBinaryFromReader(message: MqttCreateConnectorReply, reader: jspb.BinaryReader): MqttCreateConnectorReply;
}

export namespace MqttCreateConnectorReply {
  export type AsObject = {
  }
}

export class MqttDeleteConnectorRequest extends jspb.Message {
  getConnectorName(): string;
  setConnectorName(value: string): MqttDeleteConnectorRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttDeleteConnectorRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MqttDeleteConnectorRequest): MqttDeleteConnectorRequest.AsObject;
  static serializeBinaryToWriter(message: MqttDeleteConnectorRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttDeleteConnectorRequest;
  static deserializeBinaryFromReader(message: MqttDeleteConnectorRequest, reader: jspb.BinaryReader): MqttDeleteConnectorRequest;
}

export namespace MqttDeleteConnectorRequest {
  export type AsObject = {
    connectorName: string,
  }
}

export class MqttDeleteConnectorReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttDeleteConnectorReply.AsObject;
  static toObject(includeInstance: boolean, msg: MqttDeleteConnectorReply): MqttDeleteConnectorReply.AsObject;
  static serializeBinaryToWriter(message: MqttDeleteConnectorReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttDeleteConnectorReply;
  static deserializeBinaryFromReader(message: MqttDeleteConnectorReply, reader: jspb.BinaryReader): MqttDeleteConnectorReply;
}

export namespace MqttDeleteConnectorReply {
  export type AsObject = {
  }
}

export class MqttUpdateConnectorRequest extends jspb.Message {
  getConnector(): Uint8Array | string;
  getConnector_asU8(): Uint8Array;
  getConnector_asB64(): string;
  setConnector(value: Uint8Array | string): MqttUpdateConnectorRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttUpdateConnectorRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MqttUpdateConnectorRequest): MqttUpdateConnectorRequest.AsObject;
  static serializeBinaryToWriter(message: MqttUpdateConnectorRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttUpdateConnectorRequest;
  static deserializeBinaryFromReader(message: MqttUpdateConnectorRequest, reader: jspb.BinaryReader): MqttUpdateConnectorRequest;
}

export namespace MqttUpdateConnectorRequest {
  export type AsObject = {
    connector: Uint8Array | string,
  }
}

export class MqttUpdateConnectorReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttUpdateConnectorReply.AsObject;
  static toObject(includeInstance: boolean, msg: MqttUpdateConnectorReply): MqttUpdateConnectorReply.AsObject;
  static serializeBinaryToWriter(message: MqttUpdateConnectorReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttUpdateConnectorReply;
  static deserializeBinaryFromReader(message: MqttUpdateConnectorReply, reader: jspb.BinaryReader): MqttUpdateConnectorReply;
}

export namespace MqttUpdateConnectorReply {
  export type AsObject = {
  }
}

export class MqttListSchemaRequest extends jspb.Message {
  getSchemaName(): string;
  setSchemaName(value: string): MqttListSchemaRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttListSchemaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MqttListSchemaRequest): MqttListSchemaRequest.AsObject;
  static serializeBinaryToWriter(message: MqttListSchemaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttListSchemaRequest;
  static deserializeBinaryFromReader(message: MqttListSchemaRequest, reader: jspb.BinaryReader): MqttListSchemaRequest;
}

export namespace MqttListSchemaRequest {
  export type AsObject = {
    schemaName: string,
  }
}

export class MqttListSchemaReply extends jspb.Message {
  getSchemasList(): Array<Uint8Array | string>;
  setSchemasList(value: Array<Uint8Array | string>): MqttListSchemaReply;
  clearSchemasList(): MqttListSchemaReply;
  addSchemas(value: Uint8Array | string, index?: number): MqttListSchemaReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttListSchemaReply.AsObject;
  static toObject(includeInstance: boolean, msg: MqttListSchemaReply): MqttListSchemaReply.AsObject;
  static serializeBinaryToWriter(message: MqttListSchemaReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttListSchemaReply;
  static deserializeBinaryFromReader(message: MqttListSchemaReply, reader: jspb.BinaryReader): MqttListSchemaReply;
}

export namespace MqttListSchemaReply {
  export type AsObject = {
    schemasList: Array<Uint8Array | string>,
  }
}

export class MqttCreateSchemaRequest extends jspb.Message {
  getSchemaName(): string;
  setSchemaName(value: string): MqttCreateSchemaRequest;

  getSchemaType(): string;
  setSchemaType(value: string): MqttCreateSchemaRequest;

  getSchema(): string;
  setSchema(value: string): MqttCreateSchemaRequest;

  getDesc(): string;
  setDesc(value: string): MqttCreateSchemaRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttCreateSchemaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MqttCreateSchemaRequest): MqttCreateSchemaRequest.AsObject;
  static serializeBinaryToWriter(message: MqttCreateSchemaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttCreateSchemaRequest;
  static deserializeBinaryFromReader(message: MqttCreateSchemaRequest, reader: jspb.BinaryReader): MqttCreateSchemaRequest;
}

export namespace MqttCreateSchemaRequest {
  export type AsObject = {
    schemaName: string,
    schemaType: string,
    schema: string,
    desc: string,
  }
}

export class MqttCreateSchemaReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttCreateSchemaReply.AsObject;
  static toObject(includeInstance: boolean, msg: MqttCreateSchemaReply): MqttCreateSchemaReply.AsObject;
  static serializeBinaryToWriter(message: MqttCreateSchemaReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttCreateSchemaReply;
  static deserializeBinaryFromReader(message: MqttCreateSchemaReply, reader: jspb.BinaryReader): MqttCreateSchemaReply;
}

export namespace MqttCreateSchemaReply {
  export type AsObject = {
  }
}

export class MqttUpdateSchemaRequest extends jspb.Message {
  getSchemaName(): string;
  setSchemaName(value: string): MqttUpdateSchemaRequest;

  getSchemaType(): string;
  setSchemaType(value: string): MqttUpdateSchemaRequest;

  getSchema(): string;
  setSchema(value: string): MqttUpdateSchemaRequest;

  getDesc(): string;
  setDesc(value: string): MqttUpdateSchemaRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttUpdateSchemaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MqttUpdateSchemaRequest): MqttUpdateSchemaRequest.AsObject;
  static serializeBinaryToWriter(message: MqttUpdateSchemaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttUpdateSchemaRequest;
  static deserializeBinaryFromReader(message: MqttUpdateSchemaRequest, reader: jspb.BinaryReader): MqttUpdateSchemaRequest;
}

export namespace MqttUpdateSchemaRequest {
  export type AsObject = {
    schemaName: string,
    schemaType: string,
    schema: string,
    desc: string,
  }
}

export class MqttUpdateSchemaReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttUpdateSchemaReply.AsObject;
  static toObject(includeInstance: boolean, msg: MqttUpdateSchemaReply): MqttUpdateSchemaReply.AsObject;
  static serializeBinaryToWriter(message: MqttUpdateSchemaReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttUpdateSchemaReply;
  static deserializeBinaryFromReader(message: MqttUpdateSchemaReply, reader: jspb.BinaryReader): MqttUpdateSchemaReply;
}

export namespace MqttUpdateSchemaReply {
  export type AsObject = {
  }
}

export class MqttDeleteSchemaRequest extends jspb.Message {
  getSchemaName(): string;
  setSchemaName(value: string): MqttDeleteSchemaRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttDeleteSchemaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MqttDeleteSchemaRequest): MqttDeleteSchemaRequest.AsObject;
  static serializeBinaryToWriter(message: MqttDeleteSchemaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttDeleteSchemaRequest;
  static deserializeBinaryFromReader(message: MqttDeleteSchemaRequest, reader: jspb.BinaryReader): MqttDeleteSchemaRequest;
}

export namespace MqttDeleteSchemaRequest {
  export type AsObject = {
    schemaName: string,
  }
}

export class MqttDeleteSchemaReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttDeleteSchemaReply.AsObject;
  static toObject(includeInstance: boolean, msg: MqttDeleteSchemaReply): MqttDeleteSchemaReply.AsObject;
  static serializeBinaryToWriter(message: MqttDeleteSchemaReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttDeleteSchemaReply;
  static deserializeBinaryFromReader(message: MqttDeleteSchemaReply, reader: jspb.BinaryReader): MqttDeleteSchemaReply;
}

export namespace MqttDeleteSchemaReply {
  export type AsObject = {
  }
}

export class MqttListBindSchemaRequest extends jspb.Message {
  getSchemaName(): string;
  setSchemaName(value: string): MqttListBindSchemaRequest;

  getResourceName(): string;
  setResourceName(value: string): MqttListBindSchemaRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttListBindSchemaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MqttListBindSchemaRequest): MqttListBindSchemaRequest.AsObject;
  static serializeBinaryToWriter(message: MqttListBindSchemaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttListBindSchemaRequest;
  static deserializeBinaryFromReader(message: MqttListBindSchemaRequest, reader: jspb.BinaryReader): MqttListBindSchemaRequest;
}

export namespace MqttListBindSchemaRequest {
  export type AsObject = {
    schemaName: string,
    resourceName: string,
  }
}

export class MqttListBindSchemaReply extends jspb.Message {
  getSchemaBindsList(): Array<Uint8Array | string>;
  setSchemaBindsList(value: Array<Uint8Array | string>): MqttListBindSchemaReply;
  clearSchemaBindsList(): MqttListBindSchemaReply;
  addSchemaBinds(value: Uint8Array | string, index?: number): MqttListBindSchemaReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttListBindSchemaReply.AsObject;
  static toObject(includeInstance: boolean, msg: MqttListBindSchemaReply): MqttListBindSchemaReply.AsObject;
  static serializeBinaryToWriter(message: MqttListBindSchemaReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttListBindSchemaReply;
  static deserializeBinaryFromReader(message: MqttListBindSchemaReply, reader: jspb.BinaryReader): MqttListBindSchemaReply;
}

export namespace MqttListBindSchemaReply {
  export type AsObject = {
    schemaBindsList: Array<Uint8Array | string>,
  }
}

export class MqttBindSchemaRequest extends jspb.Message {
  getSchemaName(): string;
  setSchemaName(value: string): MqttBindSchemaRequest;

  getResourceName(): string;
  setResourceName(value: string): MqttBindSchemaRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttBindSchemaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MqttBindSchemaRequest): MqttBindSchemaRequest.AsObject;
  static serializeBinaryToWriter(message: MqttBindSchemaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttBindSchemaRequest;
  static deserializeBinaryFromReader(message: MqttBindSchemaRequest, reader: jspb.BinaryReader): MqttBindSchemaRequest;
}

export namespace MqttBindSchemaRequest {
  export type AsObject = {
    schemaName: string,
    resourceName: string,
  }
}

export class MqttBindSchemaReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttBindSchemaReply.AsObject;
  static toObject(includeInstance: boolean, msg: MqttBindSchemaReply): MqttBindSchemaReply.AsObject;
  static serializeBinaryToWriter(message: MqttBindSchemaReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttBindSchemaReply;
  static deserializeBinaryFromReader(message: MqttBindSchemaReply, reader: jspb.BinaryReader): MqttBindSchemaReply;
}

export namespace MqttBindSchemaReply {
  export type AsObject = {
  }
}

export class MqttUnbindSchemaRequest extends jspb.Message {
  getSchemaName(): string;
  setSchemaName(value: string): MqttUnbindSchemaRequest;

  getResourceName(): string;
  setResourceName(value: string): MqttUnbindSchemaRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttUnbindSchemaRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MqttUnbindSchemaRequest): MqttUnbindSchemaRequest.AsObject;
  static serializeBinaryToWriter(message: MqttUnbindSchemaRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttUnbindSchemaRequest;
  static deserializeBinaryFromReader(message: MqttUnbindSchemaRequest, reader: jspb.BinaryReader): MqttUnbindSchemaRequest;
}

export namespace MqttUnbindSchemaRequest {
  export type AsObject = {
    schemaName: string,
    resourceName: string,
  }
}

export class MqttUnbindSchemaReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MqttUnbindSchemaReply.AsObject;
  static toObject(includeInstance: boolean, msg: MqttUnbindSchemaReply): MqttUnbindSchemaReply.AsObject;
  static serializeBinaryToWriter(message: MqttUnbindSchemaReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MqttUnbindSchemaReply;
  static deserializeBinaryFromReader(message: MqttUnbindSchemaReply, reader: jspb.BinaryReader): MqttUnbindSchemaReply;
}

export namespace MqttUnbindSchemaReply {
  export type AsObject = {
  }
}

export class ListAutoSubscribeRuleRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAutoSubscribeRuleRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListAutoSubscribeRuleRequest): ListAutoSubscribeRuleRequest.AsObject;
  static serializeBinaryToWriter(message: ListAutoSubscribeRuleRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAutoSubscribeRuleRequest;
  static deserializeBinaryFromReader(message: ListAutoSubscribeRuleRequest, reader: jspb.BinaryReader): ListAutoSubscribeRuleRequest;
}

export namespace ListAutoSubscribeRuleRequest {
  export type AsObject = {
  }
}

export class ListAutoSubscribeRuleReply extends jspb.Message {
  getAutoSubscribeRulesList(): Array<Uint8Array | string>;
  setAutoSubscribeRulesList(value: Array<Uint8Array | string>): ListAutoSubscribeRuleReply;
  clearAutoSubscribeRulesList(): ListAutoSubscribeRuleReply;
  addAutoSubscribeRules(value: Uint8Array | string, index?: number): ListAutoSubscribeRuleReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListAutoSubscribeRuleReply.AsObject;
  static toObject(includeInstance: boolean, msg: ListAutoSubscribeRuleReply): ListAutoSubscribeRuleReply.AsObject;
  static serializeBinaryToWriter(message: ListAutoSubscribeRuleReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListAutoSubscribeRuleReply;
  static deserializeBinaryFromReader(message: ListAutoSubscribeRuleReply, reader: jspb.BinaryReader): ListAutoSubscribeRuleReply;
}

export namespace ListAutoSubscribeRuleReply {
  export type AsObject = {
    autoSubscribeRulesList: Array<Uint8Array | string>,
  }
}

export class SetAutoSubscribeRuleRequest extends jspb.Message {
  getTopic(): string;
  setTopic(value: string): SetAutoSubscribeRuleRequest;

  getQos(): number;
  setQos(value: number): SetAutoSubscribeRuleRequest;

  getNoLocal(): boolean;
  setNoLocal(value: boolean): SetAutoSubscribeRuleRequest;

  getRetainAsPublished(): boolean;
  setRetainAsPublished(value: boolean): SetAutoSubscribeRuleRequest;

  getRetainedHandling(): number;
  setRetainedHandling(value: number): SetAutoSubscribeRuleRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetAutoSubscribeRuleRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetAutoSubscribeRuleRequest): SetAutoSubscribeRuleRequest.AsObject;
  static serializeBinaryToWriter(message: SetAutoSubscribeRuleRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetAutoSubscribeRuleRequest;
  static deserializeBinaryFromReader(message: SetAutoSubscribeRuleRequest, reader: jspb.BinaryReader): SetAutoSubscribeRuleRequest;
}

export namespace SetAutoSubscribeRuleRequest {
  export type AsObject = {
    topic: string,
    qos: number,
    noLocal: boolean,
    retainAsPublished: boolean,
    retainedHandling: number,
  }
}

export class SetAutoSubscribeRuleReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetAutoSubscribeRuleReply.AsObject;
  static toObject(includeInstance: boolean, msg: SetAutoSubscribeRuleReply): SetAutoSubscribeRuleReply.AsObject;
  static serializeBinaryToWriter(message: SetAutoSubscribeRuleReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetAutoSubscribeRuleReply;
  static deserializeBinaryFromReader(message: SetAutoSubscribeRuleReply, reader: jspb.BinaryReader): SetAutoSubscribeRuleReply;
}

export namespace SetAutoSubscribeRuleReply {
  export type AsObject = {
  }
}

export class DeleteAutoSubscribeRuleRequest extends jspb.Message {
  getTopic(): string;
  setTopic(value: string): DeleteAutoSubscribeRuleRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteAutoSubscribeRuleRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteAutoSubscribeRuleRequest): DeleteAutoSubscribeRuleRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteAutoSubscribeRuleRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteAutoSubscribeRuleRequest;
  static deserializeBinaryFromReader(message: DeleteAutoSubscribeRuleRequest, reader: jspb.BinaryReader): DeleteAutoSubscribeRuleRequest;
}

export namespace DeleteAutoSubscribeRuleRequest {
  export type AsObject = {
    topic: string,
  }
}

export class DeleteAutoSubscribeRuleReply extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteAutoSubscribeRuleReply.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteAutoSubscribeRuleReply): DeleteAutoSubscribeRuleReply.AsObject;
  static serializeBinaryToWriter(message: DeleteAutoSubscribeRuleReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteAutoSubscribeRuleReply;
  static deserializeBinaryFromReader(message: DeleteAutoSubscribeRuleReply, reader: jspb.BinaryReader): DeleteAutoSubscribeRuleReply;
}

export namespace DeleteAutoSubscribeRuleReply {
  export type AsObject = {
  }
}

export enum MatchMode { 
  EXACT = 0,
  FUZZY = 1,
}
export enum OrderDirection { 
  ASC = 0,
  DESC = 1,
}
export enum BlacklistType { 
  CLIENT_ID = 0,
  USERNAME = 1,
  IP_ADDRESS = 2,
  CLIENT_ID_MATCH = 3,
  USERNAME_MATCH = 4,
  IP_CIDR = 5,
}
export enum MqttConnectorType { 
  FILE = 0,
  KAFKA = 1,
}
