import { DynamicModule, FactoryProvider, Global, Module, Provider } from '@nestjs/common';
import { Collection, Db, MongoClient } from 'mongodb';
import { MongoDBToken } from './mongodb.constants';
import { MongoHealthIndicator } from './mongodb.indicator';
import { IMongoDBAsyncOptions, IMongoDBConfigFactory } from './mongodb.interfaces';
import { IMongoDBOpts } from './mongodb.models';
import { MongoDBUtils } from './mongodb.utils';

@Global()
@Module({})
export class MongoDBModule {

  public static forRootAsync(asyncOptions: IMongoDBAsyncOptions): DynamicModule {
    const MongoOptionsProvider: FactoryProvider<IMongoDBOpts> = {
      provide: MongoDBToken.options,
      useFactory: async(optionsFactory: IMongoDBConfigFactory) => {
        const config = await optionsFactory.createMongoDBConfig();
        return config;
      },
      inject: [asyncOptions.useExisting],
    };

    const MongoDbProvider: FactoryProvider<Db> = {
      provide: MongoDBToken.client,
      useFactory: async({ dsn, db, ...opts }: IMongoDBOpts) => {
        const client = new MongoClient(dsn, opts);
        await client.connect();
        return client.db(db);
      },
      inject: [
        MongoDBToken.options,
      ],
    };

    const dynamicModule: DynamicModule = {
      module: MongoDBModule,
      imports: asyncOptions.imports,
      providers: [
        MongoOptionsProvider,
        MongoDbProvider,
        MongoHealthIndicator,
      ],
      exports: [
        MongoDbProvider,
        MongoHealthIndicator,
      ],
    };
    return dynamicModule;
  }

  public static forCollection(collection: string): Provider {
    const provider: FactoryProvider<Collection> = {
      provide: MongoDBUtils.collectionToken(collection),
      useFactory: (db: Db) => db.collection(collection),
      inject: [MongoDBToken.client],
    };
    return provider;
  }

}
