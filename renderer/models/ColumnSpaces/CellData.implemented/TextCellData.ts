import assert from "assert";
import { CellData } from "../CellData";

interface ConstructorArgs {
  text: string,
}

interface FromJsonArgs {
  text: string,
}

export class TextCellData implements CellData {
  private _text: string;

  get text() { return this._text; }

  constructor(args: ConstructorArgs) {
    assert(args.text != null, "空です");
    this._text = args.text;
  }

  toJSON() {
    return {
      text: this._text,
    }
  }

  static fronJSON(json: FromJsonArgs): CellData {
    return new TextCellData({
      text: json.text,
    });
  }

}
