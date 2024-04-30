import {
  Counter,
  CounterConfiguration,
  Gauge,
  GaugeConfiguration,
  Histogram,
  HistogramConfiguration,
  Metric,
  PrometheusContentType,
  register,
  RegistryContentType,
  Summary,
  SummaryConfiguration,
} from 'prom-client';
import { MetricTypes } from './metrics.contants';
import { IGetOrCreateMetricsProps, MetricOptions } from './metrics.models';

export class MetricsFactory {

  public static getOrCreateMetric<T extends RegistryContentType = PrometheusContentType>({ type, options, metricsOptions }: IGetOrCreateMetricsProps<T>): Metric<string> {
    const opts: MetricOptions = {
      ...options,
      name: metricsOptions?.customMetricPrefix
        ? metricsOptions.customMetricPrefix.concat('_', options.name ?? '')
        : options.name ?? '',
    };

    const existingMetric = register.getSingleMetric(opts.name);
    if (existingMetric) {
      return existingMetric;
    }

    switch (type) {
      case MetricTypes.gauge:
        return new Gauge(opts as GaugeConfiguration<string>);
      case MetricTypes.counter:
        return new Counter(opts as CounterConfiguration<string>);
      case MetricTypes.histogram:
        return new Histogram(
          opts as HistogramConfiguration<string>,
        );
      case MetricTypes.summary:
        return new Summary(opts as SummaryConfiguration<string>);
      default:
        throw new Error(`Unknown metrics type: ${type}`);
    }
  }

}
