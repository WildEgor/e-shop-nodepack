import { Inject } from '@nestjs/common';
import { RedisConstants } from './redis.constants';

export const InjectRedisClients = (): ReturnType<typeof Inject> => Inject(RedisConstants.container);
export const InjectRedisOptions = (): ReturnType<typeof Inject> => Inject(RedisConstants.options);
export const InjectRedisService = (): ReturnType<typeof Inject> => Inject(RedisConstants.service);
