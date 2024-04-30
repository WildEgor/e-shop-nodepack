import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { IContextRepository, InjectContextRepository } from './context/nestjs';
import { InjectLoggerBase, InjectLoggerOpts } from './logger.decorators';
import { ILoggerModuleOptions, ILoggerPort, ILogPayload, LogLevel, LogLevels } from './logger.models';

/**
 * @description Can used for service layer logs
 */
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements ILoggerPort {

  private readonly source: string;
  private readonly logger: ILoggerPort;
  private readonly configs: ILoggerModuleOptions;
  private readonly contextRepository: IContextRepository;

  constructor(
  @Inject(INQUIRER) parentClass: object,
    @InjectLoggerOpts()
    configs: ILoggerModuleOptions,
    @InjectLoggerBase()
    logger: ILoggerPort,
    @InjectContextRepository()
    contextRepository: IContextRepository,
  ) {
    // Set the source class from the parent class
    this.source = parentClass?.constructor?.name;
    this.configs = configs;
    this.logger = logger;
    this.contextRepository = contextRepository;
  }

  public startProfile(id: string, level?: LogLevels): void {
    this.logger.startProfile(id, level);
  }

  public setLogLevels(levels?: LogLevel[]): void {
    this.logger.setLogLevels(levels);
  }

  public verbose(message: string | Error, data?: ILogPayload | undefined, profile?: string | undefined): void {
    return this.logger.verbose(message, this.extractLogPayload(data), profile);
  }

  public debug(message: string, data?: ILogPayload, profile?: string): void {
    return this.logger.debug(message, this.extractLogPayload(data), profile);
  }

  public info(message: string, data?: ILogPayload, profile?: string): void {
    return this.logger.info(message, this.extractLogPayload(data), profile);
  }

  public warn(message: string | Error, data?: ILogPayload, profile?: string): void {
    return this.logger.warn(message, this.extractLogPayload(data), profile);
  }

  public error(message: string | Error, data?: ILogPayload, profile?: string): void {
    return this.logger.error(message, this.extractLogPayload(data), profile);
  }

  public emergency(message: string | Error, data?: ILogPayload, profile?: string): void {
    return this.logger.emergency(message, this.extractLogPayload(data), profile);
  }

  public fatal(message: string | Error, data?: ILogPayload, profile?: string): void {
    return this.logger.fatal(message, this.extractLogPayload(data), profile);
  }

  public log(
    message: string | Error,
    data?: ILogPayload,
    profile?: string,
  ): void {
    return this.print(LogLevels.Info, message, data, profile);
  }

  public print(
    level: LogLevels,
    message: string | Error,
    data?: ILogPayload,
    profile?: string,
  ): void {
    return this.logger.print(level, message, this.extractLogPayload(data), profile);
  }

  private extractLogPayload(data?: ILogPayload): ILogPayload {
    return {
      ...data,
      organization: data?.organization || this.configs?.organization || '',
      context: data?.context || this.configs?.context || '',
      app: data?.app || this.configs?.app || '',
      source: data?.source || this.source,
      correlationId:
        data?.correlationId || this.contextRepository.getContextId(),
    };
  }

}
