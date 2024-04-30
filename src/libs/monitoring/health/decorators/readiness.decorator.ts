import { applyDecorators, HttpStatus, Version } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheckResultDto } from '../dtos/health.dto';

export const ApiReadiness = (): MethodDecorator => applyDecorators(
  ApiOperation({
    summary: 'Health Check',
  }),
  ApiResponse({
    status: HttpStatus.OK,
    type: HealthCheckResultDto,
    description: 'Health check passed',
  }),
  Version('1'),
);
