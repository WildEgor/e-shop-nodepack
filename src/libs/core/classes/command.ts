import { v4 as uuid } from 'uuid';

export type CommandProps<T> = Omit<T, 'correlationId' | 'id'> &
Partial<Command>;

export class Command {

  // ID for correlation purposes
  public readonly correlationId: string;

  constructor(props?: CommandProps<unknown>) {
    this.correlationId = props?.correlationId || uuid();
  }

}
