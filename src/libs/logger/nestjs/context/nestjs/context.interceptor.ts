import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { CorrelationIdHeader } from './context.constants';
import { InjectContextRepository } from './context.decorators';
import { IContextRepository } from './context.interfaces';

/**
 * @description Add correlation id to response headers (works only with fastify and http)
 */
@Injectable()
export class LoggerCorrelationIdInterceptor implements NestInterceptor {

  private readonly context: IContextRepository;

  constructor(
  @InjectContextRepository()
    context: IContextRepository,
  ) {
    this.context = context;
  }

  intercept(context: ExecutionContext, $call: CallHandler): Observable<unknown> {
    const header = this.context.getContextId();

    if (context.getType() === 'http') {
      const res: FastifyReply = context.switchToHttp()
        .getResponse();

      res.header(CorrelationIdHeader, header);
    }

    return $call.handle();
  }

}
