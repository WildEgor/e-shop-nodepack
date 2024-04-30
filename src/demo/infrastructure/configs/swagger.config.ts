import { Injectable } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { ConfiguratorService, InjectConfigurator } from '../../../libs/configurator';
import { AppConfig } from './app.config';

@Injectable()
export class SwaggerConfig {

  private readonly title: string;
  public readonly path: string;
  public readonly url: string;

  constructor(
    @InjectConfigurator()
    private readonly configurator: ConfiguratorService,
    private readonly appConfig: AppConfig,
  ) {
    this.path = this.configurator.getString('swagger.path');
    this.url = appConfig.host + this.path;
    this.title = `${appConfig.name} - Service`;
  }

  public get cfg() {
    return new DocumentBuilder()
      .setTitle(this.title)
      .addTag('doc.json')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT Authorization',
          description: 'Enter JWT access token for authorized requests.',
          in: 'header',
        },
        'JWT Token',
      )
      .build();
  }

}
