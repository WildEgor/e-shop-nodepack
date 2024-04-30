import { Inject } from '@nestjs/common';
import { RabbitToken } from './rabbit.constants';

export const InjectRabbitClient = (): ReturnType<typeof Inject> => (
  Inject(RabbitToken.client)
);

export const InjectRabbitChannel = (): ReturnType<typeof Inject> => (
  Inject(RabbitToken.channel)
);

export const InjectRabbitPublisher = (): ReturnType<typeof Inject> => (
  Inject(RabbitToken.publish)
);

export const InjectRabbitOptions = (): ReturnType<typeof Inject> => (
  Inject(RabbitToken.options)
);
