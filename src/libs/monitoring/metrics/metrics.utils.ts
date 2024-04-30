import * as url from 'url';

export class MetricsUtils {

  /**
   * @description return μs
   */
  public static now(): number {
    if (global.process && process.hrtime) {
      const hrtime = process.hrtime;

      const hr = hrtime();
      return (hr[0] * 1e9 + hr[1]) / 1e3;
    }

    return Date.now() * 1e3;
  }

  public static since(μs: number): number {
    return MetricsUtils.now() - μs;
  }

  public static getToken(name: string): string {
    return `PROM_METRICS_${name}`;
  }

  public static normalizePath(originalUrl: string): string {
    const parsed = url.parse(originalUrl);
    return parsed.pathname || '';
  }

  public static getBaseUrl(path?: string): string {
    if (!path) {
      return path || '';
    }

    if (path.indexOf('?') === -1) {
      return path;
    }
    return path.split('?')[0];
  }

  public static normalizeStatusCode(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) {
      return '2XX';
    }
    if (statusCode >= 300 && statusCode < 400) {
      return '3XX';
    }
    if (statusCode >= 400 && statusCode < 500) {
      return '4XX';
    }

    return '5XX';
  }

}
