import { ModuleMetadata, Type } from '@nestjs/common';
import { ConnectionOptions, Envelope, MessageBody, PublisherProps } from 'rabbitmq-client';

export interface IRabbitOptionsFactory {
  createRabbitOptions(): Promise<ConnectionOptions> | ConnectionOptions;
}

export interface IRabbitAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting: Type<IRabbitOptionsFactory>;
}

export interface IPublishOptionsFactory {
  createPublishOptions(): Promise<PublisherProps> | PublisherProps;
}

export interface IPublishAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting: Type<IPublishOptionsFactory>;
}

export interface IRabbitSendOpts extends Envelope {
  correlationId?: string;
  exchange?: string;
  queue?: string;
}

export interface IRabbitPublisher {
  publish<TPayload = MessageBody>(envelop: IRabbitSendOpts, body: TPayload): Promise<void>

  send<TPayload = MessageBody>(envelop: IRabbitSendOpts, body: TPayload): Promise<void>
}
