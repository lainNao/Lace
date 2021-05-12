
export class TrimedFilledString {
  value: string;

  constructor(value: string) {
    if (!value.trim() || value === null || value === undefined) {
      throw new Error("空です");
    }
    this.value = value.trim();
  }

  toString(): string {
    return this.value;
  }

  toJSON(key): string {
    return this.value;
  }

}