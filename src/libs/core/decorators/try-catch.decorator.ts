type HandlerFunction = (error: unknown, ctx: unknown) => void;

function handleError<T, TE>(
  ctx: unknown,
  errorClass: T,
  handler: HandlerFunction,
  error: TE,
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if ('function' === typeof handler && error instanceof errorClass) {
    handler.call(null, error, ctx);
  }
  else {
    throw error;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const TryCatch = <T, TV>(errorClass: T, handler: HandlerFunction, returnValue?: TV): Function => (
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  // save a reference to the original method
  const originalMethod = descriptor.value;

  // rewrite original method with custom wrapper
  descriptor.value = function(...args: unknown[]) {
    try {
      const result = originalMethod.apply(this, args);

      // check if method is asynchronous return promise
      if (result && 'function' === typeof result.then && 'function' === typeof result.catch) {
        return result.catch((error: unknown) => {
          handleError(this, errorClass, handler, error);
          if (returnValue) {
            return returnValue;
          }
          return null;
        });
      }

      // return actual result
      return result;
    }
    catch (error) {
      handleError(this, errorClass, handler, error);
      if (returnValue) {
        return returnValue;
      }
      return null;
    }
  };

  return descriptor;
};
