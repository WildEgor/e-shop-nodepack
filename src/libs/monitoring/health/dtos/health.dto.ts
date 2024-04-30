import { ApiProperty } from '@nestjs/swagger';
import { IHealthCheckResult, THealthCheckStatus, THealthIndicatorResult } from '../interfaces/indicator.interfaces';

export class HealthCheckResultDto implements IHealthCheckResult {

  @ApiProperty({
    type: String,
  })
  public status!: THealthCheckStatus;

  @ApiProperty({
    required: false,
  })
  public info?: THealthIndicatorResult;

  @ApiProperty({
    required: false,
  })
  public error?: THealthIndicatorResult;

  @ApiProperty()
  public details!: THealthIndicatorResult;

}
