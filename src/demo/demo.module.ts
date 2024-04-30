import { Module } from '@nestjs/common';
import { LoggerModule } from '../libs/logger/nestjs';
import { HealthModule } from '../libs/monitoring/health/health.module';
import { MetricsModule } from '../libs/monitoring/metrics';
import { PrismaModule } from '../libs/prisma/prisma.module';
import { ConfigModule } from './infrastructure/configs/config.module';
import { HealthConfig } from './infrastructure/configs/health.config';
import { LoggerConfig } from './infrastructure/configs/logger.config';
import { MetricsConfig } from './infrastructure/configs/metrics.config';
import { TestModule } from './modules/test/test.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: LoggerConfig,
    }),
    HealthModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: HealthConfig,
    }),
    MetricsModule.forRootAsync({
      imports: [ConfigModule],
      useExisting: MetricsConfig,
    }),
    PrismaModule.forRootAsync({}),
    TestModule,
  ],
})
export class DemoModule {

}
