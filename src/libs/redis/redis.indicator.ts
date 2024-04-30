import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedisService } from './redis.decorator';
import { RedisService } from './redis.service';

@Injectable()
export class RedisHealthIndicator {

  private readonly logger: Logger;
  private readonly client: Redis;

  constructor(
  @InjectRedisService()
    redisService: RedisService,
  ) {
    this.logger = new Logger(RedisHealthIndicator.name);
    this.client = redisService.getClient();
  }

  public async isHealthy(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    }
    catch (e) {
      this.logger.error('Not healthy!', e);
      return false;
    }
  }

}
