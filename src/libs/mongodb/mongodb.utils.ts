import { MongoDBToken } from './mongodb.constants';

export class MongoDBUtils {

  static collectionToken(collName: string): string {
    return `${MongoDBToken.collection}_${collName}`;
  }

}
