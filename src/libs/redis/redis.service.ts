import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedisClients } from './redis.decorator';
import { RedisError } from './redis.error';
import { IRedisClientsContainer, IRedisService } from './redis.interfaces';

@Injectable()
export class RedisService implements IRedisService {

  private readonly redisContainer: IRedisClientsContainer;

  constructor(
  @InjectRedisClients()
    redisClient: IRedisClientsContainer,
  ) {
    this.redisContainer = redisClient;
  }

  public getClient(name?: string): Redis {
    const clientName = name ?? this.redisContainer.defaultKey;

    const client = this.redisContainer.clients.get(clientName);
    if (!client) {
      throw new RedisError(`Client ${name} does not exist`);
    }

    return client;
  }

  public getClients(): Map<string, Redis> {
    return this.redisContainer.clients;
  }

}
