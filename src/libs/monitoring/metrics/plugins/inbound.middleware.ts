import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Counter } from 'prom-client';
import { MetricTypes } from '../metrics.contants';
import { InjectMetricOptions } from '../metrics.decorators';
import { MetricsFactory } from '../metrics.factory';
import { IMetricsModuleOpts } from '../metrics.models';
import { MetricsUtils } from '../metrics.utils';

/**
 * @description Считаем ВСЕ запросы на сервис
 * http_all_request_total_counter - общее кол-во всех запросов по методу/пути
 */
@Injectable()
export class MetricsCountInboundHTTP implements NestMiddleware {

  private readonly options: IMetricsModuleOpts;
  private readonly reqAllTotalCounter: Counter;

  constructor(
  @InjectMetricOptions()
    options: IMetricsModuleOpts,
  ) {
    this.options = options;

    this.reqAllTotalCounter = MetricsFactory.getOrCreateMetric({
      type: MetricTypes.counter,
      options: {
        name: 'http_all_request_total_counter',
        help: 'HTTP requests - all total counter',
        labelNames: ['method', 'path'],
        ...options.withHttpMetrics?.allCounter,
      },
    }) as Counter;
  }

  use(req: FastifyRequest, _: FastifyReply, next: (error?: HttpException & Error) => void): void {
    if (!this.options?.withHttpMetrics?.enable) {
      next();
      return;
    }

    const { originalUrl, method } = req;
    const path = MetricsUtils.normalizePath(originalUrl);

    const ignoredPaths = new Set([
      '/favicon.ico',
      ...this.options.withHttpMetrics?.ignorePaths || [],
      this.options.path,
    ]);
    if (ignoredPaths.has(path)) {
      next();
      return;
    }

    this.reqAllTotalCounter.labels({ method, path }).inc(1);

    next();
  }

}
