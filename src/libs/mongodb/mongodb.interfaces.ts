import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { IMongoDBOpts } from './mongodb.models';

export interface IMongoDBConfigFactory {
  createMongoDBConfig(): Promise<IMongoDBOpts> | IMongoDBOpts;
}

export interface IMongoDBAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting: Type<IMongoDBConfigFactory>;
}
