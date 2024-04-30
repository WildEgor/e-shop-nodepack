import { Inject } from '@nestjs/common';
import { ContextConstants } from './context.constants';

export const InjectContextRepository = (): ReturnType<typeof Inject> => Inject(ContextConstants.contextRepository);
