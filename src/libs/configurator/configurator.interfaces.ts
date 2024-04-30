import { ConfigModuleOptions } from '@nestjs/config';

export interface IConfiguratorOptions extends ConfigModuleOptions {
  jsonFilePath?: string | string[];
}
