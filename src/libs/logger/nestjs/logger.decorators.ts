import { Inject } from '@nestjs/common';
import { LoggerConstants } from './logger.constants';

export const InjectLogger = (): ReturnType<typeof Inject> => Inject(LoggerConstants.logger);
export const InjectLoggerService = (): ReturnType<typeof Inject> => Inject(LoggerConstants.loggerService);
export const InjectLoggerBase = (): ReturnType<typeof Inject> => Inject(LoggerConstants.baseLogger);
export const InjectLoggerOpts = (): ReturnType<typeof Inject> => Inject(LoggerConstants.options);
