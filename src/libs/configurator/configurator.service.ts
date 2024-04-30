import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';

@Injectable()
export class ConfiguratorService {

  private readonly configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
  }

  public getString(path: string): string {
    const value = this.getValue(path);
    if (!value) {
      throw new Error(`${path} parameter does not specified correct format`);
    }
    return value;
  }

  public getRaw<TData>(path: string): TData | undefined {
    const value = this.getValue(path);

    if (value) {
      const number = Number(value);
      if (!Number.isNaN(number)) {
        return Number.parseFloat(value) as TData;
      }

      const truly = value === 'true';
      if (truly) {
        return truly as TData;
      }

      const falsy = value === 'false';
      if (falsy) {
        return truly as TData;
      }

      const date = DateTime.fromISO(value);

      if (date.isValid) {
        return date as TData;
      }
    }

    return value as TData;
  }

  public getNumber(path: string): number {
    const value = this.getValue(path);
    if (!value) {
      throw new Error(`${path} parameter does not specified correct integer format`);
    }

    const number = Number.parseFloat(value);
    if (Number.isNaN(number)) {
      throw new Error(`${path} parameter does not specified correct integer format`);
    }
    return number;
  }

  public getBoolean(path: string): boolean {
    const value = this.getValue(path);

    const truly = value === 'true';
    if (truly) {
      return truly;
    }

    const falsy = value === 'false';
    if (falsy) {
      return truly;
    }

    throw new InternalServerErrorException(
      `${path} parameter does not specified correct boolean format`,
    );
  }

  public getDateTime(path: string): DateTime {
    const value = this.getValue(path);
    if (!value) {
      throw new InternalServerErrorException(
        `${path} parameter does not specified correct Date format`,
      );
    }

    const date = DateTime.fromISO(value);

    if (!date.isValid) {
      throw new InternalServerErrorException(
        `${path} parameter does not specified correct ISO date format`,
      );
    }

    return date;
  }

  private getValue(path: string): string | undefined {
    const value = this.configService.get<string>(path);
    return value;
  }

}
