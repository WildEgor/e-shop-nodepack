import { Injectable, Logger } from '@nestjs/common';
import axios, { HttpStatusCode } from 'axios';
import { IMinioOptions } from '../client';
import { InjectMinioOpts } from './minio.decorator';

@Injectable()
export class MinioHealthIndicator {

  private readonly logger: Logger;
  private readonly opts: IMinioOptions;

  constructor(
  @InjectMinioOpts()
    opts: IMinioOptions,
  ) {
    this.logger = new Logger(MinioHealthIndicator.name);
    this.opts = opts;
  }

  public async isHealthy(): Promise<boolean> {
    try {
      const request = axios.create({
        baseURL: this.opts.useSSL ? `https://${this.opts.endPoint}` : `http://${this.opts.endPoint}`,
        responseType: 'json',
        timeout: this.opts.timeout || 10000,
      });

      const response = await request.get('minio/health/live');

      return response.status === HttpStatusCode.Ok;
    }
    catch (e) {
      this.logger.error('Not healthy!', e);
      return false;
    }
  }

}
