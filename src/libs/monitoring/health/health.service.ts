import { Injectable } from '@nestjs/common';
import { HealthCheckService } from '@nestjs/terminus';
import { InjectHealthOptions } from './decorators/inject.decorators';
import { HealthIndicator } from './health.indicator';
import { HealthIndicatorFunction, IHealthCheckResult, THealthIndicatorResult } from './interfaces/indicator.interfaces';
import { IHealthModuleOptions } from './interfaces/module.interfaces';

@Injectable()
export class HealthService {

  private readonly opts: IHealthModuleOptions;

  private readonly healthIndicator: HealthIndicator;
  private readonly healthCheckService: HealthCheckService;

  constructor(
  @InjectHealthOptions()
    opts: IHealthModuleOptions,
    healthIndicator: HealthIndicator,
    healthCheckService: HealthCheckService,
  ) {
    this.opts = opts;
    this.healthIndicator = healthIndicator;
    this.healthCheckService = healthCheckService;
  }

  public async check(): Promise<IHealthCheckResult> {
    const indicatorFn: HealthIndicatorFunction[] = [
      (): THealthIndicatorResult => this.healthIndicator.isHealthy(this.opts.name),
    ];

    if (this.opts.indicators?.length) {
      indicatorFn.push(...this.opts.indicators);
    }

    const result = await this.healthCheckService.check(indicatorFn);

    return result;
  }

}
