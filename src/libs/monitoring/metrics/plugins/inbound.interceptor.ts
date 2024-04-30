import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Counter, Gauge, Histogram, Summary } from 'prom-client';
import { Observable, catchError, map } from 'rxjs';
import { MetricTypes } from '../metrics.contants';
import { InjectMetricOptions } from '../metrics.decorators';
import { MetricsFactory } from '../metrics.factory';
import { IMetricsModuleOpts } from '../metrics.models';
import { MetricsUtils } from '../metrics.utils';

/**
 * @description считаем квантили, запросы в обработке, общее
 * http_request_total_counter - общее кол-во запросов разбитое по методу/статусу/пути
 * http_request_summary - квантили запросов
 * http_request_inflight_gauge - кол-во запросов в обработке
 * http_request_histogram - общее кол-во запросов разбитое по методу/статусу/пути/времени
 */
@Injectable()
export class MetricsStatInboundHTTPInterceptor implements NestInterceptor {

  private readonly logger: Logger;
  private readonly options: IMetricsModuleOpts;
  private readonly reqInflightGauge: Gauge;
  private readonly reqSummary: Summary;
  private readonly reqTotalCounter: Counter;
  private readonly reqHistogram: Histogram<string>;
  private readonly defaultPercentiles = [
    0.5,
    0.95,
    0.99,
  ];
  private readonly defaultBuckets = [
    0.005,
    0.01,
    0.025,
    0.05,
    0.1, // 100 ms
    0.25,
    0.5,
    1, // 1 s
    2.5,
    10];

  constructor(
  @InjectMetricOptions()
    options: IMetricsModuleOpts,
  ) {
    this.logger = new Logger(MetricsStatInboundHTTPInterceptor.name);

    this.options = options;

    this.reqTotalCounter = MetricsFactory.getOrCreateMetric({
      type: MetricTypes.counter,
      options: {
        name: 'http_request_total_counter',
        help: 'HTTP requests - total counter',
        labelNames: ['method', 'status', 'path'],
        ...options.withHttpMetrics?.totalCounter,
      },
    }) as Counter;

    this.reqSummary = MetricsFactory.getOrCreateMetric({
      type: MetricTypes.summary,
      options: {
        name: 'http_request_summary',
        help: 'HTTP requests - summary',
        labelNames: ['method', 'path'],
        percentiles: this.defaultPercentiles,
        ...options.withHttpMetrics?.durSummary,
      },
    }) as Summary;

    this.reqInflightGauge = MetricsFactory.getOrCreateMetric({
      type: MetricTypes.gauge,
      options: {
        name: 'http_request_inflight_gauge',
        help: 'HTTP requests - inflight gauge',
        ...options.withHttpMetrics?.totalCounter,
      },
    }) as Gauge;

    this.reqHistogram = MetricsFactory.getOrCreateMetric({
      type: MetricTypes.histogram,
      options: {
        name: 'http_request_histogram',
        help: 'HTTP requests - Duration in seconds',
        labelNames: ['method', 'status', 'path'],
        buckets: this.defaultBuckets,
        ...options.withHttpMetrics?.durHistogram,
      },
      metricsOptions: options,
    }) as Histogram<string>;
  }

  public intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (!this.options.withHttpMetrics?.enable) {
      return next.handle().pipe(
        map((response: FastifyReply) => response),
        catchError((exception: HttpException & Error) => {
          throw exception;
        }),
      );
    }

    const start: number = MetricsUtils.now();

    let dur = 0;

    const req = _context.switchToHttp().getRequest<FastifyRequest>();
    const res = _context.switchToHttp().getResponse<FastifyReply>();

    this.handleBefore();

    return next.handle().pipe(
      map((response: FastifyReply) => {
        dur = MetricsUtils.since(start);
        this.capture(req, res.statusCode, dur);
        return response;
      }),
      catchError((exception: HttpException & Error) => {
        dur = MetricsUtils.since(start);

        if (exception instanceof HttpException) {
          this.capture(req, exception.getStatus(), dur);
        }
        else {
          this.capture(req, HttpStatus.INTERNAL_SERVER_ERROR, dur);
        }

        throw exception;
      }),
    );
  }

  private handleBefore(): void {
    this.reqInflightGauge.inc(1);
  }

  private capture(req: FastifyRequest, statusCode: number, dur: number): void {
    const { url, method } = req;
    const path = MetricsUtils.normalizePath(url);

    const durInSec = dur / 1e6;

    if (this.options.debug) {
      this.logger.debug('Capture request: ', {
        props: {
          metricUrl: this.options.path,
          status: statusCode,
          path,
          dur: `${Number(durInSec).toFixed(3)} s`,
        },
      });
    }

    const ignoredPaths = new Set([
      '/favicon.ico',
      ...this.options.withHttpMetrics?.ignorePaths || [],
      this.options.path,
    ]);
    if (ignoredPaths.has(path)) {
      return;
    }

    const status = MetricsUtils.normalizeStatusCode(statusCode);

    this.reqInflightGauge.dec(1);
    this.reqTotalCounter.labels({ method, status, path }).inc(1);
    this.reqHistogram.observe({ method, status, path }, durInSec);
    this.reqSummary.observe({ method, path }, durInSec);
  }

}
