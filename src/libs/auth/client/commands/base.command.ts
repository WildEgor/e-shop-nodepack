import { v4 as uuidv4 } from 'uuid';
import { AuthGRPCMethods, IAuthCommand } from '../interfaces';

export class AuthBaseCommand implements IAuthCommand {

  public readonly method: AuthGRPCMethods;
  public readonly cid: string;
  public readonly payload: unknown;

  constructor({ method, cid, payload }: IAuthCommand) {
    this.method = method;
    this.cid = cid || uuidv4();
    this.payload = payload;
  }

}
