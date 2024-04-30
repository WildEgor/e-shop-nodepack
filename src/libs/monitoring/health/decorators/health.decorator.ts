import { HttpStatus, Version, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ApiHealth = (): MethodDecorator => applyDecorators(
  ApiOperation({
    summary: 'Simple service check',
  }),
  ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Health check passed',
  }),
  Version('1'),
);
