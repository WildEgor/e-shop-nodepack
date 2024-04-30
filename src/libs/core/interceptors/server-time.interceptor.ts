import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { FastifyReply, RawServerBase } from 'fastify';
import { Observable, tap } from 'rxjs';

@Injectable()
export class ServerTimeInterceptor implements NestInterceptor {

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse<FastifyReply<RawServerBase>>();

        res.header('Access-Control-Expose-Headers', 'X-SERVER-TIME');
        res.header('X-SERVER-TIME', new Date().toISOString());
      }),
    );
  }

}
