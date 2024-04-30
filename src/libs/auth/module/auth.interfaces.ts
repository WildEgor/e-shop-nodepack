import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { IAuthOptions } from '../client/auth.interfaces';

export interface IAuthConfigFactory {
  createAuthConfig(): Promise<IAuthOptions> | IAuthOptions;
}

export interface IAuthAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting: Type<IAuthConfigFactory>;
}
