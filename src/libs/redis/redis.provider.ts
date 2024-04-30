import { Provider } from '@nestjs/common';
import IORedis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { RedisConstants } from './redis.constants';
import { RedisError } from './redis.error';
import { IRedisClientsContainer, IRedisModuleOptions } from './redis.interfaces';
import { RedisService } from './redis.service';
import { RedisUtils } from './redis.utils';

export const RedisServiceProvider: Provider = {
  provide: RedisConstants.service,
  useClass: RedisService,
};

export const RedisContainerProvider: Provider = {
  provide: RedisConstants.container,
  useFactory: async(options: IRedisModuleOptions | IRedisModuleOptions[]): Promise<IRedisClientsContainer> => {
    const clients = new Map<string, IORedis>();
    let defaultKey = uuidv4();

    if (Array.isArray(options)) {
      await Promise.all(
        options.map(async(o) => {
          const key = o.name || defaultKey;
          if (clients.has(key)) {
            throw new RedisError(`Client ${o.name || 'default'} is exists`);
          }
          clients.set(key, await RedisUtils.getClient(o));
        }),
      );
    }
    else {
      if (options.name && options.name.length !== 0) {
        defaultKey = options.name;
      }
      clients.set(defaultKey, await RedisUtils.getClient(options));
    }

    return {
      defaultKey,
      clients,
      size: clients.size,
    };
  },
  inject: [RedisConstants.options],
};
