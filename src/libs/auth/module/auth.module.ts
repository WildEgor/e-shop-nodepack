import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { AuthClient } from '../client/auth.client';
import { IAuthOptions } from '../client/auth.interfaces';
import { AuthConstants } from './auth.constants';
import { IAuthAsyncOptions, IAuthConfigFactory } from './auth.interfaces';

@Global()
@Module({})
export class AuthModule {

  public static forRoot(options: IAuthOptions): DynamicModule {
    const AuthOptionsProvider: Provider = {
      provide: AuthConstants.optionsToken,
      useValue: options,
    };

    const AuthClientProvider: Provider = {
      provide: AuthConstants.clientToken,
      useFactory: () => new AuthClient(options),
    };

    return {
      module: AuthModule,
      providers: [
        AuthOptionsProvider,
        AuthClientProvider,
      ],
      exports: [
        AuthClientProvider,
      ],
    };
  }

  public static forRootAsync(asyncOptions: IAuthAsyncOptions): DynamicModule {
    const AuthOptionsProvider: Provider = {
      provide: AuthConstants.optionsToken,
      useFactory(optionsFactory: IAuthConfigFactory) {
        return optionsFactory.createAuthConfig();
      },
      inject: [asyncOptions.useExisting],
    };

    const AuthClientProvider: Provider = {
      provide: AuthConstants.clientToken,
      useFactory: (options: IAuthOptions) => new AuthClient(options),
      inject: [AuthConstants.optionsToken],
    };

    return {
      module: AuthModule,
      imports: asyncOptions.imports,
      providers: [
        AuthOptionsProvider,
        AuthClientProvider,
      ],
      exports: [
        AuthClientProvider,
      ],
    };
  }

}
