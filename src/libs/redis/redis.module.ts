import { DynamicModule, FactoryProvider, Global, Module, OnModuleDestroy } from '@nestjs/common';
import { RedisOptions } from 'ioredis';
import { RedisConstants } from './redis.constants';
import { InjectRedisClients, InjectRedisOptions } from './redis.decorator';
import { RedisHealthIndicator } from './redis.indicator';
import {
  IRedisClientsContainer,
  IRedisConfigFactory,
  IRedisModuleAsyncOptions,
  IRedisModuleOptions,
} from './redis.interfaces';
import { RedisContainerProvider, RedisServiceProvider } from './redis.provider';

@Global()
@Module({
  providers: [RedisServiceProvider],
  exports: [RedisServiceProvider],
})
export class RedisModule implements OnModuleDestroy {

  private readonly options: IRedisModuleOptions | IRedisModuleOptions[];
  private readonly container: IRedisClientsContainer;

  constructor(
  @InjectRedisOptions()
    options: IRedisModuleOptions | IRedisModuleOptions[],
    @InjectRedisClients()
    container: IRedisClientsContainer,
  ) {
    this.options = options;
    this.container = container;
  }

  public onModuleDestroy(): void {
    const closeConnection = ({ clients, defaultKey }: IRedisClientsContainer) => (options: IRedisModuleOptions) => {
      const name = options.name || defaultKey;
      const client = clients.get(name);

      if (client && !options.keepAlive) {
        client.disconnect();
      }
    };

    const closeClientConnection = closeConnection(this.container);

    if (Array.isArray(this.options)) {
      for (const opts of this.options) {
        closeClientConnection(opts);
      }
    }
    else {
      closeClientConnection(this.options);
    }
  }

  public static forRootAsync(asyncOptions: IRedisModuleAsyncOptions): DynamicModule {
    const RedisOptionsProvider: FactoryProvider<RedisOptions> = {
      provide: RedisConstants.options,
      useFactory: async(factory: IRedisConfigFactory) => {
        const options = await factory.createRedisConfig();
        return options;
      },
      inject: [asyncOptions.useExisting],
    };

    return {
      module: RedisModule,
      imports: asyncOptions.imports,
      providers: [
        RedisContainerProvider,
        RedisOptionsProvider,
        RedisHealthIndicator,
      ],
      exports: [RedisServiceProvider, RedisHealthIndicator],
    };
  }

}
