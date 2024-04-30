import { Inject } from '@nestjs/common';
import { MetricsConstants } from './metrics.contants';
import { MetricsUtils } from './metrics.utils';

/**
 * @description Использовать вместе с провайдерами из metrics.providers
 * @param name
 * @constructor
 */
export const InjectMetric = (name: string): ReturnType<typeof Inject> => (
  Inject(MetricsUtils.getToken(name))
);

export const InjectMetricOptions = (): ReturnType<typeof Inject> => (
  Inject(MetricsConstants.options)
);
