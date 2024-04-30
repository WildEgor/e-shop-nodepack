import { Injectable } from '@nestjs/common';
import { HealthIndicator as SelfHealthIndicator } from '@nestjs/terminus';
import { THealthIndicatorResult } from './interfaces/indicator.interfaces';

@Injectable()
export class HealthIndicator extends SelfHealthIndicator {

  public isHealthy(key: string): THealthIndicatorResult {
    return this.getStatus(key, true);
  }

}
