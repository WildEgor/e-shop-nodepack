import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';
import { DemoModule } from './demo/demo.module';
import { AppConfig } from './demo/infrastructure/configs/app.config';
import { LoggerConfig } from './demo/infrastructure/configs/logger.config';
import { SwaggerConfig } from './demo/infrastructure/configs/swagger.config';
import { LoggerAdapter } from './libs/logger/nestjs';

const bootstrap = async(): Promise<void> => {
  const app = await NestFactory.create<NestFastifyApplication>(
    DemoModule,
    new FastifyAdapter(),
    {
      bufferLogs: false,
    }
  );

  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const loggerConfig = app.get(LoggerConfig);
  const logger = app.get(LoggerAdapter);
  logger.setLogLevels(loggerConfig.levels);

  app.useLogger(logger);

  const appConfig = app.get(AppConfig);
  const swaggerConfig = app.get(SwaggerConfig);

  const document = SwaggerModule.createDocument(app, swaggerConfig.cfg, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup(swaggerConfig.path, app, document);

  await app.listen(appConfig.port, '0.0.0.0', () => {
    logger.verbose(`Listening at ${appConfig.host}`);
    logger.verbose(`Swagger at ${swaggerConfig.url}`);
  });
};
bootstrap()
  .catch(e => {
    throw e;
  });
