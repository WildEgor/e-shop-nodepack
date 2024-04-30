import { IAuthRequestBase } from '../auth.interfaces';
import { AuthGRPCMethods, IAuthCommand } from '../interfaces';
import { AuthBaseCommand } from './base.command';

/**
 * @return { UserData }
 */
export class ValidateTokenCommand extends AuthBaseCommand {

  public readonly payload: string;

  constructor(base: IAuthRequestBase<string>) {
    super({
      method: AuthGRPCMethods.validateToken,
      cid: base.correlationId,
      payload: base.data,
    });

    this.payload = base.data!;
  }

  public static build(base: IAuthRequestBase<string>): IAuthCommand {
    return new ValidateTokenCommand(base);
  }

}
