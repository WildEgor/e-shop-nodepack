import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

export interface IPrismaClientLikeOpts {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  $use(): void;
}

export interface IPrismaOpts {
  clientOpts?: any; // TODO
  explicitConnect?: boolean;
  middlewares?: any[]; // TODO
}

export interface IPrismaModuleOpts {
  isGlobal?: boolean;
  opts?: IPrismaOpts;
}

export interface IPrismaOptionsFactory {
  createPrismaOptions(): Promise<IPrismaOpts> | IPrismaOpts;
}

export interface IPrismaCustomClientFactory<TClient extends IPrismaClientLikeOpts> {
  createPrismaClient(): Promise<TClient> | TClient;
}

export interface IPrismaModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  useExisting?: Type<IPrismaOptionsFactory>;
  useClass?: Type<IPrismaOptionsFactory>;
  useFactory?: (
    ...args: unknown[]
  ) => Promise<IPrismaOpts> | IPrismaOpts;
  inject?: any[];
}

export interface IPrismaCustomModuleAsyncOptions<TClient extends IPrismaClientLikeOpts>
  extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  name: string;
  useClass?: Type<IPrismaCustomClientFactory<TClient>>;
  useFactory?: (...args: any[]) => Promise<TClient> | TClient;
  inject?: any[];
}
