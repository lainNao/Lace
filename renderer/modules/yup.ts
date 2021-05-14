import * as yup from 'yup';
import { AnyObject, Maybe } from "yup/lib/types";

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

declare module "yup" {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType
    > extends yup.BaseSchema<TType, TContext, TOut> {
      filled(errorMessage: string): StringSchema<TType, TContext>;
  }
}

export default yup;