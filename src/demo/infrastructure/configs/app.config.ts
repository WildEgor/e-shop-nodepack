import { Injectable } from '@nestjs/common';
import { ConfiguratorService, InjectConfigurator } from '../../../libs/configurator';

@Injectable()
export class AppConfig {

  public readonly name: string;
  public readonly port: number;

  constructor(
    @InjectConfigurator()
    private readonly configurator: ConfiguratorService,
  ) {
    this.name = this.configurator.getString('app.name');
    this.port = this.configurator.getNumber('app.port');
  }

  public get isProduction(): boolean {
    return 'production' === this.configurator.getString('app.env');
  }

  public get host(): string {
    return 'win32' === process.platform
      ? 'http://localhost:8080'
      : 'http://127.0.0.1:8080';
  }

}
