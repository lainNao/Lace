import * as yup from 'yup';
import Lazy from 'yup/lib/Lazy';
import { AnyObject, Maybe, Optionals } from "yup/lib/types";

//https://github.com/jquense/yup/issues/312
yup.addMethod<yup.StringSchema>(yup.string, "filled", function (errorMessage) {
  return this.test(`test-filled`, errorMessage, function (value) {
    const { path, createError } = this;

    return (
      String(value)?.trim()
        ? true
        : createError({ path, message: errorMessage })
    );
  });
});

yup.addMethod(yup.array, 'unique', function(message, mapper = a => a) {
  return this.test('test-unique', message, function(list) {
      return list.length === new Set(list.map(mapper)).size;
  });
});

declare module "yup" {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
  > extends yup.BaseSchema<TType, TContext, TOut> {
    filled(errorMessage: string): StringSchema<TType, TContext>;
  }

  interface ArraySchema<
    T extends yup.AnySchema | Lazy<any, any>,
    C extends AnyObject = AnyObject,
    TIn extends Maybe<yup.TypeOf<T>[]> = yup.TypeOf<T>[] | undefined,
    TOut extends Maybe<yup.Asserts<T>[]> = yup.Asserts<T>[] | Optionals<TIn>
  > extends yup.BaseSchema<TIn, C, TOut> {
    unique(errorMessage: string): ArraySchema<T, C, TIn>;
  }
}

export default yup;