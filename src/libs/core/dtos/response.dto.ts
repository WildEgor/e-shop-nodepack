// eslint-disable-next-line max-classes-per-file
import { ApiProperty } from '@nestjs/swagger';
import { DateTime } from 'luxon';

export enum CommonErrorCodes {
  UNKNOWN_ERROR = 99,
  VALIDATION_ERROR = 100,
}

export interface IErrorItem {
  key: number;
  message?: string;
}

export class ErrorItem implements IErrorItem {

  @ApiProperty()
  public key!: number;

  @ApiProperty({
    required: false,
  })
  public message?: string;

  constructor(props: ErrorItem) {
    this.key = props.key;
    this.message = props.message;
  }

}

export interface IServiceResponse<T> {
  status: string;
  message: string;
  errors: ErrorItem[];
  data: T[];
  tm_req: string;
}

export class ServiceResponseDto<T> implements IServiceResponse<T> {

  @ApiProperty()
  public status!: string;

  @ApiProperty()
  public message!: string;

  @ApiProperty({
    isArray: true,
    type: ErrorItem,
  })
  public readonly errors!: IErrorItem[];

  @ApiProperty({
    isArray: true,
  })
  public readonly data!: T[];

  @ApiProperty()
  public tm_req!: string;

  constructor() {
    this.status = '';
    this.message = '';
    this.errors = [];
    this.data = [];
    this.tm_req = '0ms';
  }

}

export class ResponseFactory {

  private payload: ServiceResponseDto<unknown>;
  private readonly tm_req_st!: number;

  constructor() {
    this.payload = new ServiceResponseDto();
    this.tm_req_st = Date.now();
  }

  public static init(): ResponseFactory {
    return new ResponseFactory();
  }

  public error(err: IErrorItem): ResponseFactory {
    this.payload.errors.push(err);
    return this;
  }

  public msg(msg: string = ''): ResponseFactory {
    this.payload.message = msg;
    return this;
  }

  public data<T>(data: T): ResponseFactory {
    if (Array.isArray(data)) {
      this.payload.data.push(...data);
    }
    else {
      this.payload.data.push(data);
    }

    return this;
  }

  public toJSON<T>(): IServiceResponse<T> {
    this.payload.status = 'ok';

    if (this.payload.errors.length) {
      this.payload.status = 'fail';
    }

    const duration = DateTime.now().diff(DateTime.fromMillis(this.tm_req_st));

    const value = duration.as('milliseconds');
    if (value < 1000) {
      this.payload.tm_req = `${value}ms`;
    }
    else if (value > 1000 && value < 60000) {
      this.payload.tm_req = `${duration.as('seconds')}s`;
    }
    else {
      this.payload.tm_req = `${duration.as('seconds')}m`;
    }

    return {
      status: this.payload.status,
      message: this.payload.message,
      errors: this.payload.errors,
      data: this.payload.data as T[],
      tm_req: this.payload.tm_req,
    };
  }

}
