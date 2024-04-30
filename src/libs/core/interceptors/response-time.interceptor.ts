import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { now, since } from 'microseconds';
import { Observable, catchError, map, tap } from 'rxjs';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {

  public intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const requestStartDate: number = now();
    let requestDuration = 0;

    return next.handle().pipe(
      tap(() => {
        requestDuration = since(requestStartDate);
      }),
      map(response => {
        Object.assign(response, {
          req_time: this.reqTimeString(requestDuration),
        });
        return response;
      }),
      catchError((exception: HttpException & Error) => {
        requestDuration = since(requestStartDate);

        Object.assign(exception, {
          req_time: this.reqTimeString(requestDuration),
        });

        throw exception;
      }),
    );
  }

  private reqTimeString(value: number): string {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return `${Math.ceil(value / 1000)}.${String(value).slice(-3)}ms`;
  }

}
