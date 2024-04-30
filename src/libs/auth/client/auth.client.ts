import { ChannelCredentials, createChannel, createClient } from 'nice-grpc';
import { AuthServiceDefinition } from '../../../@types/proto/auth';
import { IAuthOptions } from './auth.interfaces';
import { AuthOptions } from './auth.options';
import { AuthGRPCMethods, IAuthCommand } from './interfaces';

export class AuthClient {

  private readonly options: AuthOptions;

  constructor(opts: IAuthOptions) {
    this.options = new AuthOptions(opts);
  }

  public async send<T>(cmd: IAuthCommand): Promise<T> {
    let response: T = {} as T;

    const channel = createChannel(this.options.uri, ChannelCredentials.createInsecure());

    const client = createClient(
      AuthServiceDefinition,
      channel,
    );

    switch (cmd.method) {
      case AuthGRPCMethods.findByIds:
        response = await client.findByIds({
          ids: cmd.payload,
        }) as T;
        break;
      case AuthGRPCMethods.validateToken:
        response = await client.validateToken({
          token: cmd.payload,
        }) as T;
        break;
    }

    channel.close();

    return response;
  }

}
