import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import IORedis, { RedisOptions } from 'ioredis';

export type RedisClientsDict = Map<string, IORedis>;

export interface IRedisService {
  getClient(name?: string): IORedis;
  getClients(): RedisClientsDict;
}

export interface IRedisClientsContainer {
  defaultKey: string;
  clients: RedisClientsDict;
  size: number;
}

export interface IRedisModuleOptions extends RedisOptions {
  name?: string;
  url?: string;
  onClientReady?(client: IORedis): void;
}

export interface IRedisConfigFactory {
  createRedisConfig(): Promise<IRedisModuleOptions> | IRedisModuleOptions;
}

export interface IRedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting: Type<IRedisConfigFactory>;
}
