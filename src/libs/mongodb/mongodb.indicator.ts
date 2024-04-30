import { Injectable, Logger } from '@nestjs/common';
import { Db } from 'mongodb';
import { InjectMongoDb } from './mongodb.decorator';

@Injectable()
export class MongoHealthIndicator {

  private readonly logger: Logger;
  private readonly db: Db;

  constructor(
  @InjectMongoDb()
    db: Db,
  ) {
    this.logger = new Logger(MongoHealthIndicator.name);
    this.db = db;
  }

  public async isHealthy(): Promise<boolean> {
    try {
      const result = await this.db.command({ ping: 1 }, {
      });
      return result?.ok;
    }
    catch (e) {
      this.logger.error('Not healthy!', e);
      return false;
    }
  }

}
