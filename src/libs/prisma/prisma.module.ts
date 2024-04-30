import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import { PrismaConstants } from './prisma.constants';
import {
  IPrismaClientLikeOpts, IPrismaCustomClientFactory, IPrismaCustomModuleAsyncOptions,
  IPrismaModuleAsyncOptions,
  IPrismaModuleOpts,
  IPrismaOptionsFactory,
} from './prisma.interfaces';
import { PrismaService } from './prisma.service';
import { RawPrismaService } from './raw.service';

@Module({
  providers: [
    {
      provide: PrismaConstants.service,
      useClass: PrismaService,
    }
  ],
  exports: [
    {
      provide: PrismaConstants.service,
      useClass: PrismaService,
    }
  ],
})
export class PrismaModule {

  private static readonly logger = new Logger(PrismaModule.name);

  public static forRoot(opts: IPrismaModuleOpts = {}): DynamicModule {
    return {
      global: opts.isGlobal,
      module: PrismaModule,
      providers: [
        {
          provide: PrismaConstants.options,
          useValue: opts.opts,
        },
      ]
    };
  }

  static forCustomRootAsync<TClient extends IPrismaClientLikeOpts>(
    options: IPrismaCustomModuleAsyncOptions<TClient>,
  ): DynamicModule {
    return {
      global: options.isGlobal,
      module: PrismaModule,
      imports: options.imports || [],
      providers: [
        ...this.createCustomAsyncProvider(options),
        {
          provide: options.name,
          useClass: RawPrismaService,
        },
      ],
      exports: [options.name],
    };
  }

  static forRootAsync(options: IPrismaModuleAsyncOptions = {}): DynamicModule {
    return {
      global: options.isGlobal,
      module: PrismaModule,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options),
    };
  }

  private static createCustomAsyncProvider<TClient extends IPrismaClientLikeOpts>(
    options: IPrismaCustomModuleAsyncOptions<TClient>,
  ): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: PrismaConstants.client,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }

    if (options.useClass) {
      return [
        { provide: options.useClass, useClass: options.useClass },
        {
          provide: PrismaConstants.client,
          useFactory: async(
            optionsFactory: IPrismaCustomClientFactory<TClient>,
          ) => {
            const opts = await optionsFactory.createPrismaClient();
            return opts;
          },
          inject: [options.useClass],
        },
      ];
    }

    this.logger.error('You must at least provide `useFactory` or `useClass`.');

    return [];
  }

  private static createAsyncProviders(
    options: IPrismaModuleAsyncOptions,
  ): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: PrismaConstants.options,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }

    if (options.useExisting) {
      return [
        {
          provide: PrismaConstants.options,
          useFactory: async(optionsFactory: IPrismaOptionsFactory) => {
            const opts = await optionsFactory.createPrismaOptions();
            return opts;
          },
          inject: [options.useExisting]
        },
      ];
    }

    return [];
  }

}
