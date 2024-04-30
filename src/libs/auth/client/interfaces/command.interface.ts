import { AuthGRPCMethods } from './constans.interface';

export interface IAuthCommand {
  method: AuthGRPCMethods;
  cid?: string;
  payload?: any;
}
