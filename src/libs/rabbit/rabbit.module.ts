import { ClassProvider, DynamicModule, FactoryProvider, Global, Module } from '@nestjs/common';
import { Channel, Connection, ConnectionOptions, PublisherProps } from 'rabbitmq-client';
import { RabbitToken } from './rabbit.constants';
import { RabbitHealthIndicator } from './rabbit.indicator';
import {
  IPublishAsyncOptions,
  IPublishOptionsFactory,
  IRabbitAsyncOptions,
  IRabbitOptionsFactory,
} from './rabbit.interfaces';
import { RabbitPublisher } from './rabbit.publisher';

@Global()
@Module({})
export class RabbitModule {

  /**
   * Метод для инициализации подключения к RabbitMQ
   * Создает экземпляр подключения и канала
   */
  public static forRootAsync(asyncOptions: IRabbitAsyncOptions): DynamicModule {
    const RabbitOptionsProvider: FactoryProvider<ConnectionOptions> = {
      provide: RabbitToken.options,
      useFactory: async(factory: IRabbitOptionsFactory) => {
        const options = await factory.createRabbitOptions();
        return options;
      },
      inject: [asyncOptions.useExisting],
    };

    const RabbitClientProvider: FactoryProvider<Connection> = {
      provide: RabbitToken.client,
      useFactory: (options: ConnectionOptions) => {
        const client = new Connection(options);
        return client;
      },
      inject: [RabbitToken.options],
    };

    const RabbitChannelProvider: FactoryProvider<Channel> = {
      provide: RabbitToken.channel,
      useFactory: async(client: Connection) => {
        const channel = await client.acquire();
        return channel;
      },
      inject: [RabbitToken.client],
    };

    const dynamicModule: DynamicModule = {
      module: RabbitModule,
      imports: asyncOptions.imports,
      providers: [
        RabbitOptionsProvider,
        RabbitClientProvider,
        RabbitChannelProvider,
        RabbitHealthIndicator,
      ],
      exports: [
        RabbitClientProvider,
        RabbitChannelProvider,
        RabbitHealthIndicator,
        RabbitOptionsProvider,
      ],
    };

    return dynamicModule;
  }


  /**
   * Метод для инициализации экземпляра класса для публикации сообщений
   */
  public static forPublish(asyncOptions: IPublishAsyncOptions): DynamicModule {
    const RabbitOptionsProvider: FactoryProvider<PublisherProps> = {
      provide: RabbitToken.options,
      useFactory: async(factory: IPublishOptionsFactory) => {
        const options = await factory.createPublishOptions();
        return options;
      },
      inject: [asyncOptions.useExisting],
    };

    const RabbitPublisherProvider: ClassProvider<RabbitPublisher> = {
      provide: RabbitToken.publish,
      useClass: RabbitPublisher,
    };

    const dynamicModule: DynamicModule = {
      module: RabbitModule,
      providers: [
        RabbitOptionsProvider,
        RabbitPublisherProvider,
        RabbitHealthIndicator,
      ],
      exports: [
        RabbitPublisherProvider,
        RabbitHealthIndicator,
      ],
    };

    return dynamicModule;
  }

}
