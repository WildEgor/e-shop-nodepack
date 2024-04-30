import { Injectable, LogLevel } from '@nestjs/common';
import { ILoggerConfigFactory, ILoggerModuleOptions, LogLevels } from '../../../libs/logger/nestjs/logger.models';
import { AppConfig } from './app.config';

@Injectable()
export class LoggerConfig implements ILoggerConfigFactory {

  private readonly loggerConfig: ILoggerModuleOptions;
  public levels: LogLevel[];

  constructor(
    appConfig: AppConfig,
  ) {
    this.loggerConfig = {
      app: 'test',
      organization: 'unione',
      context: 'nodepack',
      console: {
        showTrace: false,
        native: false,
        format: appConfig.isProduction ? 'json' : 'pretty',
      },
    };

    this.levels = appConfig.isProduction
      ? [LogLevels.Error, LogLevels.Warn, LogLevels.Verbose]
      : [LogLevels.Log, LogLevels.Debug, LogLevels.Error, LogLevels.Warn, LogLevels.Verbose];
  }

  createLoggerConfig(): ILoggerModuleOptions {
    return this.loggerConfig;
  }

}
