import { HealthCheckError } from '@nestjs/terminus';
import { THealthIndicatorResult } from './interfaces/indicator.interfaces';

export class HealthUtils {

  /**
   * @param key
   * @param result
   */
  public static wrapBooleanResult(key: string, result: boolean): THealthIndicatorResult {
    const healthResult: THealthIndicatorResult = {
      [key]: {
        status: result ? 'up' : 'down',
      },
    };

    if (!result) {
      throw new HealthCheckError(
        `${key} is not available!`,
        healthResult,
      );
    }

    return healthResult;
  }

}
