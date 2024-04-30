import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

/**
 * @description Log payload as base for all logs
 */
export interface ILogPayload {
  /**
   * @description log correlation id. Can be used to track a request through the system(s). Get from x-correlation-id header (REST API, event) or generate a new one
   */
  correlationId?: string;
  /**
   * @description Name of the organization. For example, "unione"
   */
  organization?: string;
  /**
   * @description Name ofr project. For example, "ReportsService"
   */
  context?: string;
  /**
   * @description Additional label for log. For example, "getAllReport"
   */
  label?: string;
  /**
   * @description The app of the request. For example, "unione.buildernext.service"
   */
  app?: string;
  /**
   * @description The source of the request
   */
  source?: string;
  /**
   * @description The error of the request
   */
  error?: Error;
  /**
   * @description Additional data for log
   */
  props?: NodeJS.Dict<unknown>;
}

export enum LogColors {
  red = '\x1b[31m',
  bgRed = '\x1b[41m\x1b[30m',
  green = '\x1b[32m',
  yellow = '\x1b[33m',
  blue = '\x1b[34m',
  magenta = '\x1b[35m',
  cyan = '\x1b[36m',
  black = '\x1b',
  pink = '\x1b[38;5;206m',
}

export enum LogLevels {
  Silent = 'silent', // turn off logging
  Debug = 'debug',
  Verbose = 'verbose',
  Log = 'log',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Emergency = 'emergency',
}

export type LogLevel = LogLevels | string;
type TLogFormat = 'json' | 'pretty';

export interface IConsoleTransportOpts {
  format?: TLogFormat; // default 'pretty'
  native?: boolean; // default false
  showTrace?: boolean; // default false
}

export interface ILoggerOptions {
  console: IConsoleTransportOpts;
  transports?: unknown[];
  name?: string;
  app?: string;
  context?: string;
  organization?: string;
}

export interface ILoggerPort {

  /**
   * @description Toggle profile for logger. Adds some additional information to the log.
   * @param id
   * @param level
   */
  startProfile(id: string, level?: LogLevels): void;

  /**
   * @description Set log levels. If no levels are provided, all levels are set. If levels are provided, only those levels are set. If empty array is provided, no levels are set.
   * @param levels
   */
  setLogLevels(levels?: LogLevel[]): void;

  print(level: LogLevel, message: string | Error,
    data?: ILogPayload,
    profile?: string,
  ): void;

  /**
   * @description Base log a message
   * @param message
   * @param data
   * @param profile
   */
  log(
    message: string | Error,
    data?: ILogPayload,
    profile?: string,
  ): void;

  /**
   * @description Log a message with level `debug` and color `blue`
   * @param message
   * @param data
   * @param profile
   */
  debug(message: string, data?: ILogPayload, profile?: string): void;

  /**
   * @description Log a message with level `info` and color `green`
   * @param message
   * @param data
   * @param profile
   */
  info(message: string, data?: ILogPayload, profile?: string): void;

  /**
   * @description Log a message with level `warn` and color `yellow`
   * @param message
   * @param data
   * @param profile
   */
  warn(message: string | Error, data?: ILogPayload, profile?: string): void;

  /**
   * @description Log a message with level `error` and color `red`
   * @param message
   * @param data
   * @param profile
   */
  error(message: string | Error, data?: ILogPayload, profile?: string): void;

  /**
   * @description Log a message with level `verbose` and color `cyan`
   * @param message
   * @param data
   * @param profile
   */
  verbose(message: string | Error, data?: ILogPayload, profile?: string): void;

  /**
   * @description Log a message with level `emergency` and color `bgRed`
   * @param message
   * @param data
   * @param profile
   */
  emergency(message: string | Error, data?: ILogPayload, profile?: string): void;

  /**
   * @description Log a message with level `fatal` and color `bgRed`
   * @param message
   * @param data
   * @param profile
   */
  fatal(message: string | Error, data?: ILogPayload, profile?: string): void;

}


export interface ILoggerModuleOptions extends ILoggerOptions {
  dry?: boolean; // not impl
}

export interface ILoggerConfigFactory {
  createLoggerConfig(): Promise<ILoggerModuleOptions> | ILoggerModuleOptions;
}

export interface ILoggerAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting: Type<ILoggerConfigFactory>;
}
