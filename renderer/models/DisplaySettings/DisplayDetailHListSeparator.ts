interface ConstructorArgs {
  separator: string,
}

export class DisplayDetailHListSeparator {

  private _separator: string;

  get separator(): string { return this._separator; }

  constructor(args: ConstructorArgs) {
    this._separator = args.separator;
  }

  fromJSON(json): DisplayDetailHListSeparator {
    return new DisplayDetailHListSeparator({
      separator: json.separator,
    })
  }

  toJSON() {
    return {
      separator: this._separator,
    }
  }
}
