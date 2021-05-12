
export class TrimedFilledString {
  private _value: string;

  constructor(value: string) {
    if (!value.trim() || value === null || value === undefined) {
      throw new Error("空です");
    }
    this._value = value.trim();
  }

  toString(): string {
    return this._value;
  }

  toJSON(key): string {
    return this._value;
  }

}