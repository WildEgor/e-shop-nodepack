import { DynamicModule, FactoryProvider, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthConstants } from './health.constants';
import { HealthController } from './health.controller';
import { HealthIndicator } from './health.indicator';
import { HealthService } from './health.service';
import { IHealthConfigFactory, IHealthModuleAsyncOptions, IHealthModuleOptions } from './interfaces/module.interfaces';

@Module({
  imports: [TerminusModule],
  providers: [HealthService, HealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {

  public static forRootAsync(asyncOptions: IHealthModuleAsyncOptions): DynamicModule {
    const HealthOptionsProvider: FactoryProvider<IHealthModuleOptions> = {
      provide: HealthConstants.options,
      useFactory: async(factory: IHealthConfigFactory) => {
        const options = await factory.createHealthConfig();
        return options;
      },
      inject: [asyncOptions.useExisting],
    };

    return {
      module: HealthModule,
      imports: asyncOptions.imports,
      providers: [
        HealthOptionsProvider,
        HealthService,
        HealthIndicator,
      ],
      exports: [
        HealthOptionsProvider,
        HealthService,
        HealthIndicator,
      ],
    };
  }

}
