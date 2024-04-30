import { Inject } from '@nestjs/common';
import { PrismaConstants } from './prisma.constants';

export const InjectPrismaOptions = (): ReturnType<typeof Inject> => Inject(PrismaConstants.options);

export const InjectPrismaService = (): ReturnType<typeof Inject> => Inject(PrismaConstants.service);
