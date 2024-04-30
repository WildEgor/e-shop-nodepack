import { Inject } from '@nestjs/common';
import { WinstonConstants } from './winston.constants';

export const InjectWinstonTransports = (): ReturnType<typeof Inject> => Inject(WinstonConstants.winstonTransports);
