import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ContextModule } from './context/nestjs';
import { LoggerAdapter } from './logger.adapter';
import { LoggerConstants } from './logger.constants';
import { ILoggerAsyncOptions, ILoggerConfigFactory, ILoggerModuleOptions } from './logger.models';
import { LoggerService } from './logger.service';
import { WinstonAdapter } from './winston/nestjs';
import { WinstonConstants } from './winston/nestjs/winston.constants';
import { ConsoleTransport } from './winston/transports';

@Global()
@Module({
  imports: [ContextModule],
})
export class LoggerModule {

  public static forRootAsync(asyncOptions: ILoggerAsyncOptions): DynamicModule {
    const LoggerOptionsProvider: Provider = {
      provide: LoggerConstants.options,
      useFactory(optionsFactory: ILoggerConfigFactory) {
        return optionsFactory.createLoggerConfig();
      },
      inject: [asyncOptions.useExisting],
    };

    const LoggerWinstonAdapterProvider: Provider = {
      provide: LoggerConstants.baseLogger,
      useClass: WinstonAdapter,
    };

    const LoggerWinstonTransportsProvider: Provider = {
      provide: WinstonConstants.winstonTransports,
      useFactory: (opts: ILoggerModuleOptions) => {
        const transports: unknown[] = [];
        transports.push(ConsoleTransport.create(opts.console));

        if (opts?.transports) {
          transports.push(...opts.transports);
        }

        return transports;
      },
      inject: [LoggerConstants.options],
    };

    const LoggerLoggerServiceProvider: Provider = {
      provide: LoggerConstants.loggerService,
      useClass: LoggerService,
    };

    const LoggerAdapterProvider: Provider = {
      provide: LoggerAdapter,
      useClass: LoggerAdapter,
    };

    return {
      module: LoggerModule,
      imports: asyncOptions.imports,
      providers: [
        LoggerOptionsProvider,
        LoggerWinstonAdapterProvider,
        LoggerWinstonTransportsProvider,
        LoggerLoggerServiceProvider,
        LoggerAdapterProvider,
      ],
      exports: [
        LoggerWinstonAdapterProvider,
        LoggerLoggerServiceProvider,
        LoggerAdapterProvider,
      ],
    };
  }

}
