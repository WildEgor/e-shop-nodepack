import { ClsModule } from 'nestjs-cls';
import { ExecutionContext, Global, Module } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AsyncMessage } from 'rabbitmq-client/lib/codec';
import { v4 } from 'uuid';
import { ContextConstants, CorrelationIdHeader } from './context.constants';
import { ContextRepository } from './context.repository';

/**
 * @description CLS module used for parsing or generation correlation id for http or rabbitmq handlers
 */
@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      interceptor: {
        mount: true,
        generateId: true,
        idGenerator: (context: ExecutionContext) => {
          let correlationId = v4();

          if ('http' === context.getType()) {
            const request: FastifyRequest = context.switchToHttp().getRequest();

            const headers = request.headers[CorrelationIdHeader];
            if (headers?.length) {
              correlationId = headers[0];
            }
          }

          if ('rpc' === context.getType()) {
            // TODO: require module
            const ctx = context.switchToRpc().getContext();

            if (Array.isArray(ctx) && ctx.length) {
              const message = ctx[0] as AsyncMessage;

              Object.assign(message, {
                correlationId: message.correlationId || correlationId,
              });
            }
          }

          return correlationId;
        },
      },
    }),
  ],
  providers: [
    {
      provide: ContextConstants.contextRepository,
      useClass: ContextRepository,
    },
  ],
  exports: [
    {
      provide: ContextConstants.contextRepository,
      useClass: ContextRepository,
    },
  ],
})
export class ContextModule {
}
