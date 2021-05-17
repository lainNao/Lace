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
