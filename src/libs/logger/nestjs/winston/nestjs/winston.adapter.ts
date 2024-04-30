import { Injectable } from '@nestjs/common';
import { createLogger, format, LogEntry, Logger, LoggerOptions, transport } from 'winston';
import { InjectLoggerOpts } from '../../logger.decorators';
import { ILoggerModuleOptions, ILoggerPort, ILogPayload, LogLevel, LogLevels } from '../../logger.models';
import { InjectWinstonTransports } from './winston.decorators';

/**
 * @description Winston wrapper act as Base Logger or Logger Adapter.
 * If we decide to change the logger, we only need to impl new class.
 * Avoid direct access from your code!
 */
@Injectable()
export class WinstonAdapter implements ILoggerPort {

  private logLevels: Set<LogLevel>;
  private defaultLogsLevels: Record<LogLevel, number> = {
    debug: 0,
    verbose: 0,
    info: 0,
    warn: 0,
    error: 0,
    fatal: 0,
    emergency: 0,
  };
  private winston: Logger;

  public constructor(
  @InjectWinstonTransports()
    transports: transport[],
    @InjectLoggerOpts()
    opts: ILoggerModuleOptions,
  ) {
    // Create winston logger
    this.logLevels = new Set<LogLevel>();
    this.winston = createLogger(this.buildLoggerOptions(transports, opts));
  }

  // Setting log levels for winston
  public setLogLevels(levels?: LogLevel[]): void {
    // Disable all logs
    if (Array.isArray(levels) && levels.length === 0) {
      return;
    }

    this.defaultLogsLevels = {} as Record<LogLevel, number>;
    let counter = 0;

    // Set all levels
    if (typeof levels === 'undefined') {
      for (const level of Object.values(LogLevels)) {
        if (level === LogLevels.Silent) {
          continue;
        }

        this.logLevels.add(level);
        this.defaultLogsLevels[level] = counter;
        counter += 1;
      }

      return;
    }

    for (const level of levels) {
      // NestJS doesn't have log level 'log', so we need to add 'info' level
      if (level === LogLevels.Log) {
        this.logLevels.add(LogLevels.Info);
      }

      this.logLevels.add(level);
      this.defaultLogsLevels[level] = counter;
      counter += 1;
    }
  }

  public startProfile(id: string, level?: LogLevels): void {
    this.winston.profile(id, {
      level: level || LogLevels.Debug,
    });
  }

  public verbose(message: string | Error, data?: ILogPayload | undefined, profile?: string | undefined): void {
    return this.print(LogLevels.Verbose, message, data, profile);
  }

  public debug(message: string, data?: ILogPayload, profile?: string): void {
    return this.print(LogLevels.Debug, message, data, profile);
  }

  public info(message: string, data?: ILogPayload, profile?: string): void {
    return this.print(LogLevels.Info, message, data, profile);
  }

  public warn(message: string | Error, data?: ILogPayload, profile?: string): void {
    return this.print(LogLevels.Warn, message, data, profile);
  }

  public error(message: string | Error, data?: ILogPayload, profile?: string): void {
    return this.print(LogLevels.Error, message, data, profile);
  }

  public emergency(message: string | Error, data?: ILogPayload, profile?: string): void {
    return this.print(LogLevels.Emergency, message, data, profile);
  }

  public fatal(message: string | Error, data?: ILogPayload, profile?: string): void {
    return this.print(LogLevels.Emergency, message, data, profile);
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
    if (level === LogLevels.Silent || !this.logLevels.has(level)) {
      return;
    }

    const logData: LogEntry = {
      level,
      message: message instanceof Error ? message.message : message,
      error: message instanceof Error ? message : undefined,
      ...data,
    };

    if (profile) {
      this.winston.profile(profile, logData);
    }
    else {
      this.winston.log(logData);
    }
  }

  /**
   * @description Get logger format options
   * @param transports
   * @param opts
   * @private
   */
  private buildLoggerOptions(transports: transport[], opts: ILoggerModuleOptions): LoggerOptions {
    const baseFormat = [];

    if (opts.console?.format === 'json') {
      baseFormat.push(format.json());
    }
    else {
      baseFormat.push(format.prettyPrint());
    }

    // Errors will be logged with stack trace?
    baseFormat.push(format.errors({ stack: opts.console.showTrace }));

    return {
      levels: this.defaultLogsLevels,
      format: format.combine(
        ...baseFormat,
        // Add timestamp and format the date
        format.timestamp({
          format: 'DD/MM/YYYY, HH:mm:ss',
        }),
        // Add custom Log fields to the log
        format((info) => {
          // Info contains an Error property
          if (info.error && info.error instanceof Error) {
            info.stack = info.error.stack;
            info.error = undefined;
          }

          // Add custom fields to label
          const label = [];
          if (info?.organization) {
            label.push(info?.organization);
          }
          if (info?.context) {
            label.push(info?.context);
          }
          if (info?.app) {
            label.push(info?.app);
          }

          info.label = label.join('.');
          return info;
        })(),
        // Format the log
        format.metadata({
          key: 'data',
          fillExcept: ['timestamp', 'level', 'message'],
        }),
      ),
      transports,
      exceptionHandlers: transports,
      rejectionHandlers: transports,
    };
  }

}
