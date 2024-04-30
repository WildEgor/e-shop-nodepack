import { Global, Module } from '@nestjs/common';
import { ConfiguratorModule } from '../../../libs/configurator/configurator.module';
import { AppConfig } from './app.config';
import { HealthConfig } from './health.config';
import { LoggerConfig } from './logger.config';
import { MetricsConfig } from './metrics.config';
import { SwaggerConfig } from './swagger.config';

@Global()
@Module({
  imports: [ConfiguratorModule.forRoot({
    jsonFilePath: [
      'env.json',
    ],
  })],
  providers: [
    AppConfig,
    SwaggerConfig,
    HealthConfig,
    MetricsConfig,
    LoggerConfig,
  ],
  exports: [
    AppConfig,
    SwaggerConfig,
    HealthConfig,
    MetricsConfig,
    LoggerConfig,
  ]
})
export class ConfigModule {}
