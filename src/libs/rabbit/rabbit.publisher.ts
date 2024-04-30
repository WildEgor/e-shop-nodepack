import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Connection, MessageBody, Publisher, PublisherProps } from 'rabbitmq-client';
import { v4 } from 'uuid';
import { InjectRabbitClient, InjectRabbitOptions } from './rabbit.decorators';
import { IRabbitPublisher, IRabbitSendOpts } from './rabbit.interfaces';

@Injectable()
export class RabbitPublisher implements IRabbitPublisher, OnModuleDestroy {

  private readonly publisher: Publisher;

  constructor(
  @InjectRabbitClient()
    client: Connection,
    @InjectRabbitOptions()
    opts: PublisherProps,
  ) {
    this.publisher = client.createPublisher(opts);
  }

  async onModuleDestroy(): Promise<void> {
    await this.publisher.close();
  }

  public async publish<TPayload = MessageBody>(opts: IRabbitSendOpts, payload: TPayload): Promise<void> {
    await this.send(opts, payload);
  }

  /**
   * Allow to send to queue or exchange with predefined correlation id
   * @param opts
   * @param payload
   */
  public async send<TPayload = MessageBody>(opts: IRabbitSendOpts, payload: TPayload): Promise<void> {
    const correlationId = opts.correlationId || v4();

    if (opts.exchange) {
      await this.publisher.send({
        ...opts,
        exchange: opts.exchange,
        correlationId,
      }, payload);
    }

    if (opts.queue) {
      await this.publisher.send({
        ...opts,
        exchange: 'direct',
        routingKey: opts.queue,
        correlationId,
      }, payload);
    }

    throw new Error('Exchange or queue not specified');
  }

}
