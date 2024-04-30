export enum AuthMethodTopics {
  findUsersByIds = 'auth.find-by-ids',
  validateToken = 'auth.validate-token',
}

export interface IAuthUserDto {
  id: string;
  mobileNumber: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface IAuthRequestBase<TData> {
  data?: TData;
  correlationId?: string;
}

export interface IAuthUserBody<TData> extends IAuthRequestBase<TData> {
  id: string;
  pattern: string;
  service: string;
  key: string;
}

export interface IAuthOptions {
  host: string;
  port: number;
  service: string; // service name used, ex. qabat.notifier.service
  key: string; // key for services
}
