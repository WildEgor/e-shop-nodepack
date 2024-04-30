import { Inject, Injectable } from '@nestjs/common';
import { PrismaConstants } from './prisma.constants';
import { IPrismaClientLikeOpts } from './prisma.interfaces';

@Injectable()
export class RawPrismaService<TClient extends IPrismaClientLikeOpts> {

  constructor(
    @Inject(PrismaConstants.client)
    public client: TClient,
    // eslint-disable-next-line no-empty-function
  ) {}

}
