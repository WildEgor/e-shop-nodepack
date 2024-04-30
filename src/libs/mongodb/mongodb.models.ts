import { MongoClientOptions } from 'mongodb';

export interface IMongoDBOpts extends MongoClientOptions {
  dsn: string;
  db: string;
}
