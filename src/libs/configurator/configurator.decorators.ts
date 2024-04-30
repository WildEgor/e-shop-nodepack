import { Inject } from '@nestjs/common';
import { ConfiguratorConstants } from './configurator.constants';

export const InjectConfigurator = (): ReturnType<typeof Inject> => (
  Inject(ConfiguratorConstants.serviceToken)
);
