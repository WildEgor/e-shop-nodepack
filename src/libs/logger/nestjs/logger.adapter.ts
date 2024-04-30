import { ConsoleLogger, Inject, Injectable, LogLevel } from '@nestjs/common';
import { LoggerService } from '@nestjs/common/services/logger.service';
import { INQUIRER } from '@nestjs/core';
import { IContextRepository, InjectContextRepository } from './context/nestjs';
import { InjectLoggerOpts, InjectLoggerService } from './logger.decorators';
import { ILoggerModuleOptions, ILoggerPort, ILogPayload } from './logger.models';

/**
 * @description Can used as replacement for NestJS Logger (without any changes in the code)
 */
@Injectable()
export class LoggerAdapter
  extends ConsoleLogger
  implements LoggerService {

  private readonly logger: ILoggerPort;
  private readonly source: string | undefined;
  private readonly configs: ILoggerModuleOptions;
  private readonly contextRepository: IContextRepository;

  public constructor(
  @Inject(INQUIRER) parentClass: object,
    @InjectLoggerOpts() configs: ILoggerModuleOptions,
    @InjectLoggerService() logger: ILoggerPort,
    @InjectContextRepository() contextRepository: IContextRepository,
  ) {
    super();
    this.logger = logger;
    this.configs = configs;
    this.contextRepository = contextRepository;
    this.source = parentClass?.constructor?.name;
  }

  public setLogLevels(levels: LogLevel[]): void {
    this.logger.setLogLevels(levels);
  }

  public log(message: string, ...optionalParams: never[]): void {
    return this.logger.log(message, this.getLogPayload(optionalParams));
  }

  public error(message: string, ...optionalParams: never[]): void {
    return this.logger.error(message, this.getLogPayload(optionalParams));
  }

  public warn(message: string, ...optionalParams: never[]): void {
    return this.logger.warn(message, this.getLogPayload(optionalParams));
  }

  public debug(message: string, ...optionalParams: never[]): void {
    return this.logger.debug(message, this.getLogPayload(optionalParams));
  }

  public verbose(message: string, ...optionalParams: never[]): void {
    return this.logger.verbose(message, this.getLogPayload(optionalParams));
  }

  private getLogPayload(optionalParams: unknown): ILogPayload {
    if (Array.isArray(optionalParams)) {
      const data = optionalParams?.length === 2 ? optionalParams[0] : {};

      return {
        ...data,
        organization: data?.organization || this.configs?.organization || 'unione',
        context: data?.context || this.configs?.context || '-',
        app: data?.app || this.configs?.app || '-',
        source: data?.source || this.source,
        correlationId:
          data?.correlationId || this.contextRepository.getContextId(),
      };
    }

    return {
      props: {
        msg: optionalParams,
      },
      organization: this.configs?.organization || 'unione',
      context: this.configs?.context || '-',
      app: this.configs?.app || '-',
      source: this.source,
      correlationId: this.contextRepository.getContextId(),
    };
  }

}
