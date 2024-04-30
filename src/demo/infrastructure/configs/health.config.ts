import { Injectable } from '@nestjs/common';
import {
  IHealthConfigFactory,
  IHealthModuleOptions,
} from '../../../libs/monitoring/health/interfaces/module.interfaces';
import { AppConfig } from './app.config';

@Injectable()
export class HealthConfig implements IHealthConfigFactory {

  private readonly opts: IHealthModuleOptions;

  constructor(
    appConfig: AppConfig,
  ) {
    this.opts = {
      name: appConfig.name,
      indicators: [],
    };
  }

  createHealthConfig(): IHealthModuleOptions | Promise<IHealthModuleOptions> {
    return this.opts;
  }

}
