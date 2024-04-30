/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "auth.proxy";

export interface UserData {
  id: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface FindByIdsRequest {
  ids: string[];
}

export interface FindByIdsResponse {
  users: UserData[];
  total: number;
}

function createBaseUserData(): UserData {
  return { id: "", phone: "", email: "", firstName: "", lastName: "", isActive: false };
}

export const UserData = {
  encode(message: UserData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.phone !== "") {
      writer.uint32(18).string(message.phone);
    }
    if (message.email !== "") {
      writer.uint32(26).string(message.email);
    }
    if (message.firstName !== "") {
      writer.uint32(34).string(message.firstName);
    }
    if (message.lastName !== "") {
      writer.uint32(42).string(message.lastName);
    }
    if (message.isActive === true) {
      writer.uint32(48).bool(message.isActive);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.phone = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.email = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.firstName = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.lastName = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.isActive = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UserData {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      phone: isSet(object.phone) ? globalThis.String(object.phone) : "",
      email: isSet(object.email) ? globalThis.String(object.email) : "",
      firstName: isSet(object.firstName) ? globalThis.String(object.firstName) : "",
      lastName: isSet(object.lastName) ? globalThis.String(object.lastName) : "",
      isActive: isSet(object.isActive) ? globalThis.Boolean(object.isActive) : false,
    };
  },

  toJSON(message: UserData): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.phone !== "") {
      obj.phone = message.phone;
    }
    if (message.email !== "") {
      obj.email = message.email;
    }
    if (message.firstName !== "") {
      obj.firstName = message.firstName;
    }
    if (message.lastName !== "") {
      obj.lastName = message.lastName;
    }
    if (message.isActive === true) {
      obj.isActive = message.isActive;
    }
    return obj;
  },

  create(base?: DeepPartial<UserData>): UserData {
    return UserData.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<UserData>): UserData {
    const message = createBaseUserData();
    message.id = object.id ?? "";
    message.phone = object.phone ?? "";
    message.email = object.email ?? "";
    message.firstName = object.firstName ?? "";
    message.lastName = object.lastName ?? "";
    message.isActive = object.isActive ?? false;
    return message;
  },
};

function createBaseValidateTokenRequest(): ValidateTokenRequest {
  return { token: "" };
}

export const ValidateTokenRequest = {
  encode(message: ValidateTokenRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.token !== "") {
      writer.uint32(10).string(message.token);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValidateTokenRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidateTokenRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.token = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ValidateTokenRequest {
    return { token: isSet(object.token) ? globalThis.String(object.token) : "" };
  },

  toJSON(message: ValidateTokenRequest): unknown {
    const obj: any = {};
    if (message.token !== "") {
      obj.token = message.token;
    }
    return obj;
  },

  create(base?: DeepPartial<ValidateTokenRequest>): ValidateTokenRequest {
    return ValidateTokenRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ValidateTokenRequest>): ValidateTokenRequest {
    const message = createBaseValidateTokenRequest();
    message.token = object.token ?? "";
    return message;
  },
};

function createBaseFindByIdsRequest(): FindByIdsRequest {
  return { ids: [] };
}

export const FindByIdsRequest = {
  encode(message: FindByIdsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.ids) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FindByIdsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFindByIdsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.ids.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FindByIdsRequest {
    return { ids: globalThis.Array.isArray(object?.ids) ? object.ids.map((e: any) => globalThis.String(e)) : [] };
  },

  toJSON(message: FindByIdsRequest): unknown {
    const obj: any = {};
    if (message.ids?.length) {
      obj.ids = message.ids;
    }
    return obj;
  },

  create(base?: DeepPartial<FindByIdsRequest>): FindByIdsRequest {
    return FindByIdsRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<FindByIdsRequest>): FindByIdsRequest {
    const message = createBaseFindByIdsRequest();
    message.ids = object.ids?.map((e) => e) || [];
    return message;
  },
};

function createBaseFindByIdsResponse(): FindByIdsResponse {
  return { users: [], total: 0 };
}

export const FindByIdsResponse = {
  encode(message: FindByIdsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.users) {
      UserData.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.total !== 0) {
      writer.uint32(16).int32(message.total);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FindByIdsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFindByIdsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.users.push(UserData.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.total = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FindByIdsResponse {
    return {
      users: globalThis.Array.isArray(object?.users) ? object.users.map((e: any) => UserData.fromJSON(e)) : [],
      total: isSet(object.total) ? globalThis.Number(object.total) : 0,
    };
  },

  toJSON(message: FindByIdsResponse): unknown {
    const obj: any = {};
    if (message.users?.length) {
      obj.users = message.users.map((e) => UserData.toJSON(e));
    }
    if (message.total !== 0) {
      obj.total = Math.round(message.total);
    }
    return obj;
  },

  create(base?: DeepPartial<FindByIdsResponse>): FindByIdsResponse {
    return FindByIdsResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<FindByIdsResponse>): FindByIdsResponse {
    const message = createBaseFindByIdsResponse();
    message.users = object.users?.map((e) => UserData.fromPartial(e)) || [];
    message.total = object.total ?? 0;
    return message;
  },
};

export type AuthServiceDefinition = typeof AuthServiceDefinition;
export const AuthServiceDefinition = {
  name: "AuthService",
  fullName: "auth.proxy.AuthService",
  methods: {
    validateToken: {
      name: "ValidateToken",
      requestType: ValidateTokenRequest,
      requestStream: false,
      responseType: UserData,
      responseStream: false,
      options: {},
    },
    findByIds: {
      name: "FindByIds",
      requestType: FindByIdsRequest,
      requestStream: false,
      responseType: FindByIdsResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface AuthServiceImplementation<CallContextExt = {}> {
  validateToken(request: ValidateTokenRequest, context: CallContext & CallContextExt): Promise<DeepPartial<UserData>>;
  findByIds(request: FindByIdsRequest, context: CallContext & CallContextExt): Promise<DeepPartial<FindByIdsResponse>>;
}

export interface AuthServiceClient<CallOptionsExt = {}> {
  validateToken(request: DeepPartial<ValidateTokenRequest>, options?: CallOptions & CallOptionsExt): Promise<UserData>;
  findByIds(request: DeepPartial<FindByIdsRequest>, options?: CallOptions & CallOptionsExt): Promise<FindByIdsResponse>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
