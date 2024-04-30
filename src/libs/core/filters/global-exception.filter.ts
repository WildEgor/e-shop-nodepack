import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { EMPTY, Observable } from 'rxjs';
import { CommonErrorCodes, ErrorItem, ResponseFactory } from '../dtos';
import { WrapException } from '../exceptions/wrap.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

  private readonly _logger: Logger;

  constructor(
  ) {
    this._logger = new Logger(GlobalExceptionFilter.name);
  }

  catch(exception: WrapException | HttpException | Error, host: ArgumentsHost): Observable<unknown> {
    const response = host.switchToHttp().getResponse<FastifyReply>();
    const request = host.switchToHttp().getRequest<FastifyRequest>();
    const resp = ResponseFactory.init();

    let errorItem: ErrorItem = {
      message: exception.message,
      key: CommonErrorCodes.UNKNOWN_ERROR,
    };

    if (this.isWrapException(exception)) {
      for (const errorItem of exception.errors) {
        resp.error(errorItem);
      }
    }

    if (this.isHttpException(exception)) {
      errorItem.key = CommonErrorCodes.UNKNOWN_ERROR;
      errorItem.message = exception.message;

      if (exception.getStatus() === HttpStatus.BAD_REQUEST) {
        errorItem = exception.getResponse() as ErrorItem;
      }

      resp.error(errorItem);
    }

    this._logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorItem),
      GlobalExceptionFilter.name,
    );
    this._logger.error(exception.stack);

    response
      .status(HttpStatus.OK)
      .send(resp.toJSON());

    return EMPTY;
  }

  private isHttpException(err: unknown): err is HttpException {
    return err instanceof HttpException;
  }

  public isWrapException(err: unknown): err is WrapException {
    return err instanceof WrapException;
  }

}
