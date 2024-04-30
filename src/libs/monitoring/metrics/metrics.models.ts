import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import {
  CounterConfiguration,
  DefaultMetricsCollectorConfiguration,
  GaugeConfiguration,
  HistogramConfiguration,
  PrometheusContentType,
  RegistryContentType,
  SummaryConfiguration,
} from 'prom-client';
import { MetricTypes } from './metrics.contants';

export type TMetricsDefaultContentType = 'text/plain; version=0.0.4; charset=utf-8';

export interface IGetOrCreateMetricsProps<
  T extends RegistryContentType = PrometheusContentType,
> {
  type: MetricTypes;
  options: MetricOptions;
  metricsOptions?: IMetricsModuleOpts<T>;
}

export type MetricOptions =
  | GaugeConfiguration<string>
  | SummaryConfiguration<string>
  | CounterConfiguration<string>
  | HistogramConfiguration<string>;

export interface IPrometheusDefaultMetrics<
  T extends RegistryContentType = PrometheusContentType,
> {
  enabled: boolean;
  config?: DefaultMetricsCollectorConfiguration<T>;
}

export interface IMetricsModuleOpts<
  T extends RegistryContentType = PrometheusContentType,
> {
  global?: boolean;
  customMetricPrefix?: string;
  controller?: Type<unknown>;
  path?: string;
  debug?: boolean;
  withDefaultMetrics?: IPrometheusDefaultMetrics<T>;
  withDefaultLabels?: NodeJS.Dict<unknown>;
  withExceptionsMetrics?: {
    enable?: boolean;
    opts?: MetricOptions;
  };
  withHttpMetrics?: {
    enable?: boolean;
    ignorePaths?: string[];
    durSummary?: Pick<SummaryConfiguration<string>, 'name' | 'help' | 'percentiles'>;
    durHistogram?: Pick<HistogramConfiguration<string>, 'name' | 'help' | 'buckets'>;
    allCounter?: Pick<MetricOptions, 'name' | 'help'>;
    totalCounter?: Pick<MetricOptions, 'name' | 'help'>;
    inflightGauge?: Pick<MetricOptions, 'name' | 'help'>;
  };
}

export type MetricsOptionsWithDefaults<
  T extends RegistryContentType = PrometheusContentType,
> = Required<Omit<IMetricsModuleOpts<T>, 'customMetricPrefix' | 'withHttpMetrics' | 'withExceptionsMetrics'>>;

export interface IMetricsOptionsFactory<
  T extends RegistryContentType = PrometheusContentType,
> {
  createMetricsOptions():
  | Promise<IMetricsModuleOpts<T>>
  | IMetricsModuleOpts<T>;
}

export interface IMetricsAsyncOptions<
  T extends RegistryContentType = PrometheusContentType,
> extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<IMetricsOptionsFactory<T>>;
  useClass?: Type<IMetricsOptionsFactory<T>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];
  controller?: IMetricsModuleOpts<T>['controller'];
  useFactory?(
    ...args: unknown[]
  ): Promise<IMetricsModuleOpts<T>> | IMetricsModuleOpts<T>;
}
