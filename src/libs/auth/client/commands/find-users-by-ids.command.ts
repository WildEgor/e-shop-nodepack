import { IAuthRequestBase } from '../auth.interfaces';
import { AuthGRPCMethods, IAuthCommand } from '../interfaces';
import { AuthBaseCommand } from './base.command';

/**
 * @return { FindByIdsResponse }
 */
export class FindUsersByIdsCommand extends AuthBaseCommand {

  public readonly payload: string[];

  constructor(base: IAuthRequestBase<string[]>) {
    super({
      method: AuthGRPCMethods.findByIds,
      cid: base.correlationId,
      payload: base.data,
    });

    this.payload = base.data!;
  }

  public static build(base: IAuthRequestBase<string[]>): IAuthCommand {
    return new FindUsersByIdsCommand(base);
  }

}
