export enum AuthConstants {
  clientToken = 'auth_module_client_token',
  optionsToken = 'auth_module_options_token',
  publicToken = 'auth_module_public_token',
}

export enum Errors {
  UNAUTHORIZED = 'UNAUTHORIZED',
  ACCESS_TOKEN_EXPIRED = 'ACCESS_TOKEN_EXPIRED',
  ACCESS_TOKEN_NOT_FOUND = 'ACCESS_TOKEN_NOT_FOUND',
}

export const AUTH_TAG = 'auth';
