import * as jspb from 'google-protobuf'



export class UpdateMQTTCacheRequest extends jspb.Message {
  getClusterName(): string;
  setClusterName(value: string): UpdateMQTTCacheRequest;

  getActionType(): MQTTBrokerUpdateCacheActionType;
  setActionType(value: MQTTBrokerUpdateCacheActionType): UpdateMQTTCacheRequest;

  getResourceType(): MQTTBrokerUpdateCacheResourceType;
  setResourceType(value: MQTTBrokerUpdateCacheResourceType): UpdateMQTTCacheRequest;

  getData(): string;
  setData(value: string): UpdateMQTTCacheRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMQTTCacheRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMQTTCacheRequest): UpdateMQTTCacheRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateMQTTCacheRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMQTTCacheRequest;
  static deserializeBinaryFromReader(message: UpdateMQTTCacheRequest, reader: jspb.BinaryReader): UpdateMQTTCacheRequest;
}

export namespace UpdateMQTTCacheRequest {
  export type AsObject = {
    clusterName: string,
    actionType: MQTTBrokerUpdateCacheActionType,
    resourceType: MQTTBrokerUpdateCacheResourceType,
    data: string,
  }
}

export class UpdateMQTTCacheReply extends jspb.Message {
  getCode(): boolean;
  setCode(value: boolean): UpdateMQTTCacheReply;

  getData(): string;
  setData(value: string): UpdateMQTTCacheReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMQTTCacheReply.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMQTTCacheReply): UpdateMQTTCacheReply.AsObject;
  static serializeBinaryToWriter(message: UpdateMQTTCacheReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMQTTCacheReply;
  static deserializeBinaryFromReader(message: UpdateMQTTCacheReply, reader: jspb.BinaryReader): UpdateMQTTCacheReply;
}

export namespace UpdateMQTTCacheReply {
  export type AsObject = {
    code: boolean,
    data: string,
  }
}

export class DeleteSessionRequest extends jspb.Message {
  getClusterName(): string;
  setClusterName(value: string): DeleteSessionRequest;

  getClientIdList(): Array<string>;
  setClientIdList(value: Array<string>): DeleteSessionRequest;
  clearClientIdList(): DeleteSessionRequest;
  addClientId(value: string, index?: number): DeleteSessionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteSessionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteSessionRequest): DeleteSessionRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteSessionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteSessionRequest;
  static deserializeBinaryFromReader(message: DeleteSessionRequest, reader: jspb.BinaryReader): DeleteSessionRequest;
}

export namespace DeleteSessionRequest {
  export type AsObject = {
    clusterName: string,
    clientIdList: Array<string>,
  }
}

export class DeleteSessionReply extends jspb.Message {
  getCode(): boolean;
  setCode(value: boolean): DeleteSessionReply;

  getData(): string;
  setData(value: string): DeleteSessionReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteSessionReply.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteSessionReply): DeleteSessionReply.AsObject;
  static serializeBinaryToWriter(message: DeleteSessionReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteSessionReply;
  static deserializeBinaryFromReader(message: DeleteSessionReply, reader: jspb.BinaryReader): DeleteSessionReply;
}

export namespace DeleteSessionReply {
  export type AsObject = {
    code: boolean,
    data: string,
  }
}

export class SendLastWillMessageReply extends jspb.Message {
  getCode(): boolean;
  setCode(value: boolean): SendLastWillMessageReply;

  getData(): string;
  setData(value: string): SendLastWillMessageReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendLastWillMessageReply.AsObject;
  static toObject(includeInstance: boolean, msg: SendLastWillMessageReply): SendLastWillMessageReply.AsObject;
  static serializeBinaryToWriter(message: SendLastWillMessageReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendLastWillMessageReply;
  static deserializeBinaryFromReader(message: SendLastWillMessageReply, reader: jspb.BinaryReader): SendLastWillMessageReply;
}

export namespace SendLastWillMessageReply {
  export type AsObject = {
    code: boolean,
    data: string,
  }
}

export class SendLastWillMessageRequest extends jspb.Message {
  getClientId(): string;
  setClientId(value: string): SendLastWillMessageRequest;

  getLastWillMessage(): Uint8Array | string;
  getLastWillMessage_asU8(): Uint8Array;
  getLastWillMessage_asB64(): string;
  setLastWillMessage(value: Uint8Array | string): SendLastWillMessageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendLastWillMessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SendLastWillMessageRequest): SendLastWillMessageRequest.AsObject;
  static serializeBinaryToWriter(message: SendLastWillMessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendLastWillMessageRequest;
  static deserializeBinaryFromReader(message: SendLastWillMessageRequest, reader: jspb.BinaryReader): SendLastWillMessageRequest;
}

export namespace SendLastWillMessageRequest {
  export type AsObject = {
    clientId: string,
    lastWillMessage: Uint8Array | string,
  }
}

export enum MQTTBrokerUpdateCacheActionType { 
  SET = 0,
  DELETE = 1,
}
export enum MQTTBrokerUpdateCacheResourceType { 
  SESSION = 0,
  USER = 1,
  SUBSCRIBE = 2,
  TOPIC = 3,
  CONNECTOR = 4,
  SCHEMA = 5,
  SCHEMARESOURCE = 6,
  CLUSTERRESOURCECONFIG = 7,
  NODE = 8,
}
