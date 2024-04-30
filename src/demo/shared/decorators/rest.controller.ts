import { Controller, UseFilters, UseInterceptors, UsePipes, applyDecorators, } from '@nestjs/common';
import { GlobalExceptionFilter } from '../../../libs/core';
import { ServerTimeInterceptor } from '../../../libs/core/interceptors/server-time.interceptor';
import { GlobalValidationPipe } from '../../../libs/core/pipes';
import { LoggerCorrelationIdInterceptor } from '../../../libs/logger/nestjs';
import {
  MetricsCatchAllExceptionsFilter,
  MetricsStatInboundHTTPInterceptor
} from '../../../libs/monitoring/metrics/plugins';

export const RESTController = (): ReturnType<typeof applyDecorators> => applyDecorators(
  UsePipes(new GlobalValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  })),
  UseInterceptors(MetricsStatInboundHTTPInterceptor, LoggerCorrelationIdInterceptor, ServerTimeInterceptor),
  UseFilters(MetricsCatchAllExceptionsFilter, GlobalExceptionFilter),
  Controller(),
);
