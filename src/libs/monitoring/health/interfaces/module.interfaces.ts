import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { HealthIndicatorFunction } from './indicator.interfaces';

export interface IHealthModuleOptions {
  name: string;
  indicators?: HealthIndicatorFunction[];
}

export interface IHealthConfigFactory {
  createHealthConfig(): Promise<IHealthModuleOptions> | IHealthModuleOptions;
}

export interface IHealthModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting: Type<IHealthConfigFactory>;
}
