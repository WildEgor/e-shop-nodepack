import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiHealth } from './decorators/health.decorator';
import { ApiReadiness } from './decorators/readiness.decorator';
import { HealthService } from './health.service';
import { IHealthCheckResult } from './interfaces/indicator.interfaces';

@ApiTags('Health Controller')
@Controller()
export class HealthController {

  private readonly service: HealthService;

  constructor(
    service: HealthService,
  ) {
    this.service = service;
  }

  @ApiHealth()
  @Get('health/service')
  // eslint-disable-next-line no-empty-function
  public ping(): void {
  }

  @ApiReadiness()
  @Get('health/readiness')
  public async readiness(): Promise<IHealthCheckResult> {
    const result = await this.service.check();
    return result;
  }

}
