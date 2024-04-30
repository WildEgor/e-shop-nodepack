import {
  CustomDecorator,
  ExecutionContext,
  Inject,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { IAuthUserDto } from '../client/auth.interfaces';
import { AuthConstants } from './auth.constants';

export const InjectAuth = (): ReturnType<typeof Inject> => Inject(AuthConstants.clientToken);

export const PublicRoute = (): CustomDecorator<AuthConstants> => SetMetadata(AuthConstants.publicToken, true);

export const ExtractUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): IAuthUserDto => {
  const req = ctx
    .switchToHttp()
    .getRequest();

  return req?.user;
});
