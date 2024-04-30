import { ErrorItem } from '../dtos';
import { ExceptionBase } from './base.exception';

export class WrapException extends ExceptionBase {

  public readonly errors: ErrorItem[];

  constructor() {
    super();
    this.errors = [];
  }

  public add(err: ErrorItem): WrapException {
    this.errors.push(err);

    return this;
  }

}
