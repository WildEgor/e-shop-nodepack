import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { Counter } from 'prom-client';
import { MetricTypes } from '../metrics.contants';
import { InjectMetricOptions } from '../metrics.decorators';
import { MetricsFactory } from '../metrics.factory';
import { IMetricsModuleOpts } from '../metrics.models';
import { MetricsUtils } from '../metrics.utils';

/**
 * @description Ловим любую ошибку и считаем
 * http_request_error_counter - счетчик по методу/статусу/пути
 */
@Catch()
export class MetricsCatchAllExceptionsFilter extends BaseExceptionFilter {

  private readonly options: IMetricsModuleOpts;
  private readonly counter: Counter;

  constructor(
  @InjectMetricOptions()
    options: IMetricsModuleOpts,
  ) {
    super();

    this.options = options;

    this.counter = MetricsFactory.getOrCreateMetric({
      type: MetricTypes.counter,
      options: {
        name: 'http_request_error_counter',
        help: 'HTTP requests - errors counter',
        labelNames: ['method', 'status', 'path'],
        ...options.withExceptionsMetrics?.opts,
      },
      metricsOptions: options,
    }) as Counter;
  }

  catch(
    exception: unknown,
    host: ArgumentsHost,
  ): void {
    if (!this.options?.withExceptionsMetrics?.enable) {
      super.catch(exception, host);
      return;
    }

    const ctx = host.switchToHttp();
    const { originalUrl, url, method } = ctx.getRequest<FastifyRequest>();

    const statusCode
      = exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const baseUrl = MetricsUtils.getBaseUrl(originalUrl || url);
    const path = MetricsUtils.normalizePath(baseUrl);
    // const status = MetricsUtils.normalizeStatusCode(statusCode);

    this.counter.labels({
      method,
      status: statusCode,
      path,
    }).inc(1);

    super.catch(exception, host);
  }

}
