import { v4 as uuidv4 } from 'uuid';
import { TrimedFilledString } from "../../value-objects/TrimedFilledString";
import { RelatedCellsDisplaySetting } from ".";
import assert from 'assert';

interface ConstructorArgs {
  id?: string,
  name: TrimedFilledString,
  sortColumns: string[],
  mainColumn: string,
  relatedCellsDisplaySetting: RelatedCellsDisplaySetting,
}

export class DisplaySetting {
  private _id: string;
  private _name: TrimedFilledString;
  private _sortColumns: string[];
  private _mainColumn: string;
  private _relatedCellsDisplaySetting: RelatedCellsDisplaySetting;

  get id() { return this._id; }
  get name() { return this._name.toString(); }
  get sortColumns() { return this._sortColumns; }
  get mainColumn() { return this._mainColumn; }
  get relatedCellsDisplaySetting() { return this._relatedCellsDisplaySetting; }

  static get MIN_SORT_COLUMN_LENGTH() { return 1; }
  static get MAX_SORT_COLUMN_LENGTH() { return 5; }

  constructor(args: ConstructorArgs) {
    const id = args.id ?? uuidv4();

    // それぞれnullやundefinedじゃないこと
    assert.ok(id !== null && id !== undefined, "idが空です");
    assert.ok(args.name !== null && args.name !== undefined, "表示名が空です");
    assert.ok(args.sortColumns !== null && args.sortColumns !== undefined, "ソートカラムが空です");
    assert.ok(args.mainColumn !== null && args.mainColumn !== undefined, "メインカラムが空です");
    assert.ok(args.relatedCellsDisplaySetting !== null && args.relatedCellsDisplaySetting !== undefined, "関連セル表示形式が空です");

    // sortColumnsがかぶってはいけないこと
    // TODO ここらへん、staticメソッドに切り出して例のフォームでも使えるようにしたほうがいいのでは
    assert.ok(args.sortColumns.length === new Set(args.sortColumns).size, "ソートカラムにかぶりがあります")

    // sortColumnsの中にmainColumnと同じのが入ってはいけないこと
    // TODO ここらへん、staticメソッドに切り出して例のフォームでも使えるようにしたほうがいいのでは
    assert.ok(!args.sortColumns.includes(args.mainColumn), "ソートカラムの中にメインカラムと同じカラムを持てません")

    // sortColumnsの長さが適切なこと
    assert.ok(DisplaySetting.isValidSortColumnLength(args.sortColumns.length), "ソートカラムの長さに問題があります")

    this._id = id;
    this._name = args.name;
    this._sortColumns = args.sortColumns;
    this._mainColumn = args.mainColumn;
    this._relatedCellsDisplaySetting = args.relatedCellsDisplaySetting;
  }

  static isValidSortColumnLength(length: number): boolean {
    return this.MIN_SORT_COLUMN_LENGTH <= length && length <= this.MAX_SORT_COLUMN_LENGTH;
  }

  static createNewFromJSON(json): DisplaySetting {
    json.id = json.id ?? uuidv4();
    return DisplaySetting.fromJSON(json);
  }

  static fromJSON(json): DisplaySetting {
    return new DisplaySetting({
      id: json.id,
      name: new TrimedFilledString(json.name),
      sortColumns: json.sortColumns,
      mainColumn: json.mainColumn,
      relatedCellsDisplaySetting: RelatedCellsDisplaySetting.fromJSON(json.relatedCellsDisplaySetting),
    })
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name.toString(),
      sortColumns: this._sortColumns,
      mainColumn: this._mainColumn,
      relatedCellsDisplaySetting: this._relatedCellsDisplaySetting,
    }
  }

  removeSpecificColumnAssociatedItem(columnId: string): DisplaySetting {

    // ソートカラムから対象カラムを削除
    this._sortColumns = this._sortColumns.filter(sortColumn => sortColumn !== columnId);

    // CustomListの場合そこで使うカラムを使ってるものは消す
    this._relatedCellsDisplaySetting = this._relatedCellsDisplaySetting.removeSpecificColumnAssociatedItem(columnId);

    return new DisplaySetting({
      id: this._id,
      name: this._name,
      sortColumns: this._sortColumns,
      mainColumn: this._mainColumn,
      relatedCellsDisplaySetting: this._relatedCellsDisplaySetting,
    });
  }

}
