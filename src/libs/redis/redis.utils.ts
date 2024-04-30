import IORedis from 'ioredis';
import { IRedisModuleOptions } from './redis.interfaces';

export class RedisUtils {

  public static getClient(options: IRedisModuleOptions): IORedis {
    const { onClientReady, url, ...opt } = options;
    const client = url ? new IORedis(url) : new IORedis(opt);

    if (onClientReady) {
      onClientReady(client);
    }

    return client;
  }

}
