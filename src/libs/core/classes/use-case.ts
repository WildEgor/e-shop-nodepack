import { Command } from './command';

export abstract class UseCase<
  TReturn = unknown,
  TError extends Error = Error,
> {

  // Forces all handlers to implement a handle method
  abstract handle(
    command: Command,
  ): Promise<
  TReturn |
  TError
  >;

  execute(
    command: Command,
  ): Promise<
    TReturn |
    TError
    > {
    // eslint-disable-next-line require-await
    return this.handle(command);
  }

}
