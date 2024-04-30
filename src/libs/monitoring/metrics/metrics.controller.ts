import { Controller, Get, Header } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { Type } from '@nestjs/common/interfaces';
import { register } from 'prom-client';

@Controller()
export class MetricsController {

  @Get()
  @Header('Content-Type', register.contentType)
  index(): Promise<string> {
    return register.metrics();
  }

  public static forRoot(path = 'v1/metrics'): Type<unknown> {
    Reflect.defineMetadata(PATH_METADATA, path, MetricsController);
    return MetricsController;
  }

}
