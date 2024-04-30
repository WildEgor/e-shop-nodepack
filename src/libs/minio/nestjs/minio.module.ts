import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { Client } from 'minio';
import { IMinioOptions } from '../client';
import { MinioConstants } from './minio.constants';
import { MinioHealthIndicator } from './minio.indicator';
import { IMinioAsyncOptions, IMinioConfigFactory } from './minio.interfaces';

@Global()
@Module({})
export class MinioModule {

  public static forRoot(options: IMinioOptions): DynamicModule {
    const MinioOptionsProvider: Provider = {
      provide: MinioConstants.optionsToken,
      useValue: options,
    };

    const MinioClientProvider: Provider = {
      provide: MinioConstants.clientToken,
      useFactory: () => new Client(options),
    };

    const dynamicModule: DynamicModule = {
      module: MinioModule,
      providers: [
        MinioOptionsProvider,
        MinioClientProvider,
        MinioHealthIndicator,
      ],
      exports: [
        MinioClientProvider,
        MinioHealthIndicator,
      ],
    };

    return dynamicModule;
  }

  public static forRootAsync(asyncOptions: IMinioAsyncOptions): DynamicModule {
    const MinioOptionsProvider: Provider = {
      provide: MinioConstants.optionsToken,
      useFactory(optionsFactory: IMinioConfigFactory) {
        return optionsFactory.createMinioConfig();
      },
      inject: [asyncOptions.useExisting],
    };

    const MinioClientProvider: Provider = {
      provide: MinioConstants.clientToken,
      useFactory: (options: IMinioOptions) => new Client(options),
      inject: [MinioConstants.optionsToken],
    };

    const dynamicModule: DynamicModule = {
      module: MinioModule,
      imports: asyncOptions.imports,
      providers: [
        MinioOptionsProvider,
        MinioClientProvider,
        MinioHealthIndicator,
      ],
      exports: [
        MinioClientProvider,
        MinioHealthIndicator,
      ],
    };

    return dynamicModule;
  }

}
