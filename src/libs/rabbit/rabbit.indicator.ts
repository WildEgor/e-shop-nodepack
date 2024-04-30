import { Injectable, Logger } from '@nestjs/common';
import { Channel } from 'rabbitmq-client';
import { InjectRabbitChannel } from './rabbit.decorators';

@Injectable()
export class RabbitHealthIndicator {

  private readonly logger: Logger;
  private readonly channel: Channel;

  constructor(
  @InjectRabbitChannel()
    channel: Channel,
  ) {
    this.logger = new Logger(RabbitHealthIndicator.name);
    this.channel = channel;
  }

  public isHealthy(): boolean {
    try {
      return this.channel.active;
    }
    catch (e) {
      this.logger.error('Not healthy!', e);
      return false;
    }
  }

}
