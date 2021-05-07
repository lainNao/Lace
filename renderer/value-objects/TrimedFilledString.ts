
export class TrimedFilledString {
  value: string;

  constructor(value: string) {
    this.value = value.trim();
  }

  toString(): string {
    return this.value;
  }

  toJSON(key): string {
    return this.value;
  }

  isValid(): boolean {
    return this.value.length > 0;
  }

}