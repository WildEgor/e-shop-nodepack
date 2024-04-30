import { IAuthOptions } from './auth.interfaces';

export class AuthOptions {

  private readonly host: string;
  private readonly port: number;

  constructor(config: IAuthOptions) {
    this.host = this.validateString('host', config.host);
    this.port = this.validateNumber('port', config.port);
  }

  public get uri(): string {
    return `${this.host}:${this.port}`;
  }

  private validateString(key: keyof IAuthOptions, value: unknown): string {
    if (typeof value !== 'string' || 0 === value.length) {
      throw new Error(`Parameter with key "${key}" cannot be parsed as string`);
    }
    return value;
  }

  private validateNumber(key: keyof IAuthOptions, value: unknown): number {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new Error(`Parameter with key "${key}" cannot be parsed as number`);
    }
    return value;
  }

}
