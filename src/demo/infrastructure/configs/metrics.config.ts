import { Injectable } from '@nestjs/common';
import {
  IMetricsModuleOpts,
  IMetricsOptionsFactory,
  TMetricsDefaultContentType,
} from '../../../libs/monitoring/metrics';

@Injectable()
export class MetricsConfig implements IMetricsOptionsFactory {

  createMetricsOptions(): IMetricsModuleOpts<TMetricsDefaultContentType> {
    return {
      path: '/v1/metrics',
      debug: false,
      withExceptionsMetrics: {
        enable: true,
      },
      withDefaultMetrics: {
        enabled: true,
      },
      withHttpMetrics: {
        enable: true,
        ignorePaths: [
          '/v1/metrics',
          '/v1/health/service',
        ],
      },
    };
  }

}
