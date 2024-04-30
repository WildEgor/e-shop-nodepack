import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { IMinioOptions } from '../client';

export interface IMinioConfigFactory {
  createMinioConfig(): Promise<IMinioOptions> | IMinioOptions;
}

export interface IMinioAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting: Type<IMinioConfigFactory>;
}
