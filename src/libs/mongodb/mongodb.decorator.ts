import { Inject } from '@nestjs/common';
import { MongoDBToken } from './mongodb.constants';
import { MongoDBUtils } from './mongodb.utils';

export const InjectMongoDb = (): ReturnType<typeof Inject> => (
  Inject(MongoDBToken.client)
);

export const InjectCollection = (collName: string): ReturnType<typeof Inject> => {
  const token = MongoDBUtils.collectionToken(collName);
  return Inject(token);
};
