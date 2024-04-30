import { DynamicModule, MiddlewareConsumer, Module, Provider } from '@nestjs/common';
import * as promClient from 'prom-client';
import {
  Metric,
  PrometheusContentType,
  RegistryContentType,
} from 'prom-client';
import { MetricTypes, MetricsConstants } from './metrics.contants';
import { MetricsController } from './metrics.controller';
import { MetricsFactory } from './metrics.factory';
import {
  IMetricsAsyncOptions,
  IMetricsModuleOpts,
  IMetricsOptionsFactory, MetricOptions,
  MetricsOptionsWithDefaults,
} from './metrics.models';
import { MetricsUtils } from './metrics.utils';
import { MetricsCountInboundHTTP } from './plugins';

@Module({})
export class MetricsModule {

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MetricsCountInboundHTTP).forRoutes('*');
  }

  public static forRootAsync<T extends promClient.RegistryContentType>(options: IMetricsAsyncOptions<T>): DynamicModule {
    const providers = this.createAsyncProviders(options);
    const controllers = options.controller ?? MetricsController.forRoot();

    const moduleForRoot: DynamicModule = {
      global: true,
      module: MetricsModule,
      controllers: [controllers],
      imports: options.imports,
      providers: [
        ...providers,
        {
          provide: MetricsConstants.client,
          inject: [MetricsConstants.options],
          useFactory(
            userOptions: IMetricsModuleOpts<T>,
          ): typeof promClient {
            const opts = MetricsModule.makeDefaultOptions(userOptions);

            MetricsModule.configureServer(opts);

            return promClient;
          },
        },
      ],
      exports: [...providers],
    };

    return moduleForRoot;
  }

  public static createAsyncProviders<T extends promClient.RegistryContentType>(
    options: IMetricsAsyncOptions<T>,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [
        this.createAsyncOptionsProvider(options),
      ];
    }

    if (!options.useClass) {
      throw new Error(
        'Invalid configuration. Must provide useClass or useExisting',
      );
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  public static createAsyncOptionsProvider<T extends promClient.RegistryContentType>(
    options: IMetricsAsyncOptions<T>,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: MetricsConstants.options,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = options.useClass || options.useExisting;

    if (!inject) {
      throw new Error(
        'Invalid configuration. Must provide useClass or useExisting',
      );
    }

    return {
      provide: MetricsConstants.options,
      async useFactory(
        optionsFactory: IMetricsOptionsFactory<T>,
      ): Promise<IMetricsModuleOpts<T>> {
        const config = await optionsFactory.createMetricsOptions();
        return config;
      },
      inject: [inject],
    };
  }

  public static forFeature(
    type: MetricTypes,
    options: MetricOptions,
  ): Provider {
    switch (type) {
      case MetricTypes.counter:
        return MetricsModule.makeCounterProvider(options);
      case MetricTypes.gauge:
        return MetricsModule.makeGaugeProvider(options);
      case MetricTypes.histogram:
        return MetricsModule.makeHistogramProvider(options);
      case MetricTypes.summary:
        return MetricsModule.makeSummaryProvider(options);
      default:
        throw new Error(`Unknown metrics type: ${type}`);
    }
  }

  private static makeCounterProvider = (
    options: MetricOptions,
  ): Provider => ({
    provide: MetricsUtils.getToken(options.name),
    useFactory<T extends RegistryContentType = PrometheusContentType>(
      config?: IMetricsModuleOpts<T>,
    ): Metric<string> {
      return MetricsFactory.getOrCreateMetric({ type: MetricTypes.counter, options, metricsOptions: config });
    },
    inject: [
      {
        token: MetricsConstants.options,
        optional: true,
      },
    ],
  });

  private static makeGaugeProvider = (
    options: MetricOptions,
  ): Provider => ({
    provide: MetricsUtils.getToken(options.name),
    useFactory<T extends RegistryContentType = PrometheusContentType>(
      config?: IMetricsModuleOpts<T>,
    ): Metric<string> {
      return MetricsFactory.getOrCreateMetric({ type: MetricTypes.gauge, options, metricsOptions: config });
    },
    inject: [
      {
        token: MetricsConstants.options,
        optional: true,
      },
    ],
  });

  private static makeHistogramProvider = (
    options: MetricOptions,
  ): Provider => ({
    provide: MetricsUtils.getToken(options.name),
    useFactory<T extends RegistryContentType = PrometheusContentType>(
      config?: IMetricsModuleOpts<T>,
    ): Metric<string> {
      return MetricsFactory.getOrCreateMetric({ type: MetricTypes.histogram, options, metricsOptions: config });
    },
    inject: [
      {
        token: MetricsConstants.options,
        optional: true,
      },
    ],
  });

  private static makeSummaryProvider = (
    options: MetricOptions,
  ): Provider => ({
    provide: MetricsUtils.getToken(options.name),
    useFactory<T extends RegistryContentType = PrometheusContentType>(
      config?: IMetricsModuleOpts<T>,
    ): Metric<string> {
      return MetricsFactory.getOrCreateMetric({ type: MetricTypes.summary, options, metricsOptions: config });
    },
    inject: [
      {
        token: MetricsConstants.options,
        optional: true,
      },
    ],
  });

  private static configureServer<T extends promClient.RegistryContentType>(
    options: MetricsOptionsWithDefaults<T>,
  ): void {
    if (options.withDefaultMetrics.enabled) {
      promClient.collectDefaultMetrics(options.withDefaultMetrics.config);
    }

    if (Object.keys(options.withDefaultLabels).length > 0) {
      promClient.register.setDefaultLabels(options.withDefaultLabels);
    }

    Reflect.defineMetadata('path', options.path, options.controller);
  }

  private static makeDefaultOptions<T extends promClient.RegistryContentType>(
    options?: IMetricsModuleOpts<T>,
  ): MetricsOptionsWithDefaults<T> {
    return {
      global: false,
      path: 'v1/metrics',
      debug: false,
      withDefaultMetrics: {
        enabled: true,
        config: {},
      },
      controller: MetricsController,
      withDefaultLabels: {},
      ...options,
    };
  }

}
