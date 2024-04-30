import { Injectable, OnModuleInit, Optional } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { InjectPrismaOptions } from './prisma.decorator';
import { IPrismaOpts } from './prisma.interfaces';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit {

  constructor(
    @Optional()
    @InjectPrismaOptions()
    private readonly options: IPrismaOpts = {},
  ) {
    super(options.clientOpts);

    if (this.options.middlewares?.length) {
      for (const middleware of this.options.middlewares) {
        this.$use(middleware);
      }
    }
  }

  public async onModuleInit() {
    if (this.options.explicitConnect) {
      await this.$connect();
    }
  }

}
