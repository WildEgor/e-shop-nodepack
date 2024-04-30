export interface ISerializedException {
  message: string;
  stack?: string;
  metadata?: unknown;
}

// Base class for custom exceptions.
export abstract class ExceptionBase extends Error {

  private readonly metadata: unknown;

  /**
   * @param {string} message
   * @param {ObjectLiteral} [metadata={}]
   * **BE CAREFUL** not to include sensitive info in 'metadata'
   * to prevent leaks since all exception's data will end up
   * in application's log files. Only include non-sensitive
   * info that may help with debugging.
   */
  constructor(message?: string, metadata?: unknown) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.metadata = metadata;
  }

  /**
   * By default, in NodeJS Error objects are not
   * serialized properly when sending plain objects
   * to external processes. This method is a workaround.
   * **BE CAREFUL** not return a stack trace to user when in production.
   */
  public toJSON(): ISerializedException {
    return {
      message: this.message || '',
      stack: this.stack,
      metadata: this.metadata,
    };
  }

}
