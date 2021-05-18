import { TrimedFilledString } from "../../../value-objects/TrimedFilledString";
import { CellData } from "../CellData";

interface ConstructorArgs {
  title: TrimedFilledString,
  text: string,
}

interface FromJsonArgs {
  title: string,
  text: string,
}

export class MarkdownCellData implements CellData {
  private _title: TrimedFilledString;
  private _text: string;

  get title() { return this._title.toString(); }
  get text() { return this._text; }

  constructor(args: ConstructorArgs) {
    this._title = args.title;
    this._text = args.text;
  }

  toJSON() {
    return {
      title: this._title,
      text: this._text,
    }
  }

  static fronJSON(json: FromJsonArgs): CellData {
    return new MarkdownCellData({
      title: new TrimedFilledString(json.title),
      text: json.text,
    });
  }

}
