import { CustomListColumnSetting } from ".";
import { TrimedFilledString } from "../../value-objects/TrimedFilledString";

interface ConstructorArgs {
  title: TrimedFilledString,
  columns: CustomListColumnSetting[],
}

export class DisplayDetailCustomList {

  private _title: TrimedFilledString;
  private _columns: CustomListColumnSetting[];

  constructor(args: ConstructorArgs) {
    this._title = args.title;
    this._columns = args.columns;
  }

  get title(): string { return this._title.toString(); }
  get columns(): CustomListColumnSetting[] { return this._columns; }

  static get MIN_COLUMN_LENGTH() { return 1; }
  static get MAX_COLUMN_LENGTH(): number { return 99; }

  static isValidColumnLength(length: number): boolean {
    return this.MIN_COLUMN_LENGTH <= length && length <= this.MAX_COLUMN_LENGTH;
  }

  static fromJSON(json: any): DisplayDetailCustomList {
    return new DisplayDetailCustomList({
      title: new TrimedFilledString(json.title),
      columns: json.columns.map(column => {
        return new CustomListColumnSetting(column);
      })
    })
  }

  toJSON() {
    return {
      title: this._title,
      columns: this._columns,
    }
  }

}
