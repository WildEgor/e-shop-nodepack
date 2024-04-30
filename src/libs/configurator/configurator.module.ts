import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfiguratorConstants } from './configurator.constants';
import { IConfiguratorOptions } from './configurator.interfaces';
import { ConfiguratorService } from './configurator.service';
import { jsonLoader } from './configurator.utils';

@Global()
@Module({})
export class ConfiguratorModule {

  public static forRoot(options: IConfiguratorOptions): DynamicModule {
    const ConfiguratorServiceProvider: Provider = {
      provide: ConfiguratorConstants.serviceToken,
      useFactory: (configService: ConfigService) => new ConfiguratorService(configService),
      inject: [ConfigService],
    };

    const load = options.jsonFilePath ? [jsonLoader] : [];

    const dynamicModule: DynamicModule = {
      module: ConfiguratorModule,
      imports: [
        ConfigModule.forRoot({
          ...options,
          load: [...load, ...(options.load || [])],
        }),
      ],
      providers: [
        ConfiguratorServiceProvider,
      ],
      exports: [
        ConfiguratorServiceProvider,
      ],
    };

    return dynamicModule;
  }

}
