import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { AuthClient } from '../client';
import { ValidateTokenCommand } from '../client/commands';
import { AuthConstants, Errors } from './auth.constants';
import { InjectAuth } from './auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {

  private readonly logger: Logger;
  private readonly authClient: AuthClient;
  private readonly reflector: Reflector;

  constructor(
  @InjectAuth()
    authClient: AuthClient,
    reflector: Reflector,
  ) {
    this.logger = new Logger(AuthGuard.name);
    this.authClient = authClient;
    this.reflector = reflector;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get(AuthConstants.publicToken, context.getHandler());
    const request = this.getRequest(context);
    const token = this.extractTokenFromRequest(request.headers.authorization);

    try {
      if (token) {
        const cmd = ValidateTokenCommand.build({
          data: token,
        });

        const response = await this.authClient.send(cmd);

        Object.assign(request, {
          user: response,
        });

        return true;
      }
    }
    catch (error) {
      this.logger.verbose(error);
    }

    if (isPublic) {
      return true;
    }

    if (!token) {
      this.throwError(context, Errors.ACCESS_TOKEN_NOT_FOUND);
    }

    this.throwError(context, Errors.ACCESS_TOKEN_EXPIRED);

    return false;
  }

  private throwError(ctx: ExecutionContext, code?: string): void {
    this.logger.verbose(code);

    throw new UnauthorizedException(code ?? Errors.UNAUTHORIZED);
  }

  private getRequest(ctx: ExecutionContext): FastifyRequest {
    return ctx.switchToHttp()
      .getRequest<FastifyRequest>();
  }

  private extractTokenFromRequest(authorization?: string): string | undefined {
    if (authorization && authorization.trim().startsWith('Bearer') && 2 === authorization.split(' ').length) {
      return authorization.split(' ')[1];
    }

    return undefined;
  }

}
