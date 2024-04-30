export type HealthIndicatorStatus = 'up' | 'down';

export type THealthIndicatorResult = {
  [key: string]: {
    status: HealthIndicatorStatus;
    [optionalKeys: string]: unknown;
  };
};

export type THealthCheckStatus = 'error' | 'ok' | 'shutting_down';

export interface IHealthCheckResult {
  status: THealthCheckStatus;
  info?: THealthIndicatorResult;
  error?: THealthIndicatorResult;
  details: THealthIndicatorResult;
}

export type HealthIndicatorFunction = () => PromiseLike<THealthIndicatorResult> | THealthIndicatorResult;
