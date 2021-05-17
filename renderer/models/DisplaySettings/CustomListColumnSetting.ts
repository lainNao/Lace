interface ConstructorArgs {
  columnId: string,
  prefix?: string,
  suffix?: string,
  needBreakLine: boolean,
}

export class CustomListColumnSetting {

  private _columnId: string;
  private _prefix: string;
  private _suffix: string;
  private _needBreakLine: boolean;

  get columnId() { return this._columnId; }
  get prefix() { return this._prefix; }
  get suffix() { return this._suffix; }
  get needBreakLine() { return this._needBreakLine; }

  constructor(args: ConstructorArgs) {
    this._columnId = args.columnId;
    this._prefix = args.prefix;
    this._suffix = args.suffix;
    this._needBreakLine = args.needBreakLine;
  }

  static fromJSON(json) {
    return new CustomListColumnSetting({
      columnId: json.columnId,
      prefix: json.prefix,
      suffix: json.suffix,
      needBreakLine: json.needBreakLine,
    });
  }

  toJSON() {
    return {
      columnId: this._columnId,
      prefix: this._prefix,
      suffix: this._suffix,
      needBreakLine: this._needBreakLine,
    }
  }


}
