export abstract class AggregateRoot<T> {

  public props: T;

  protected constructor(props: T) {
    this.props = Object.freeze<T>(props);
  }

}
