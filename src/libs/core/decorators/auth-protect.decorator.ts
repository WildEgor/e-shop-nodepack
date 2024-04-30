import {
  Controller,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  applyDecorators,
} from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { AUTH_TAG, AuthGuard } from '../../auth/module';
import { GlobalExceptionFilter } from '../filters';
import { ResponseTimeInterceptor } from '../interceptors/response-time.interceptor';
import { ServerTimeInterceptor } from '../interceptors/server-time.interceptor';

export const AuthProtectedController = (): ReturnType<typeof applyDecorators> => applyDecorators(
  ApiSecurity(AUTH_TAG),
  UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  })),
  UseGuards(AuthGuard),
  UseInterceptors(ServerTimeInterceptor, ResponseTimeInterceptor),
  UseFilters(GlobalExceptionFilter),
  Controller(),
);
