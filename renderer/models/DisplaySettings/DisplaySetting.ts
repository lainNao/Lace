import { v4 as uuidv4 } from 'uuid';
import { TrimedFilledString } from "../../value-objects/TrimedFilledString";
import { RelatedCellsDisplaySetting } from ".";
import assert from 'assert';

interface ConstructorArgs {
  id?: string,
  name: TrimedFilledString,
  sortColumns: string[],
  mainColumn: string,
  relatedCellsDisplaySettings: RelatedCellsDisplaySetting[],
}

export class DisplaySetting {
  private _id: string;
  private _name: TrimedFilledString;
  private _sortColumns: string[];
  private _mainColumn: string;
  private _relatedCellsDisplaySettings: RelatedCellsDisplaySetting[];

  get id() { return this._id; }
  get name() { return this._name.toString(); }
  get sortColumns() { return this._sortColumns; }
  get mainColumn() { return this._mainColumn; }
  get relatedCellsDisplaySettings() { return this._relatedCellsDisplaySettings; }

  static get MIN_SORT_COLUMN_LENGTH() { return 1; }
  static get MAX_SORT_COLUMN_LENGTH() { return 5; }
  static get MIN_RELATED_CELLS_DISPLAY_SETTINGS_LENGTH() { return 1; }
  static get MAX_RELATED_CELLS_DISPLAY_SETTINGS_LENGTH() { return 99; }

  constructor(args: ConstructorArgs) {
    const id = args.id ?? uuidv4();

    // それぞれnullやundefinedじゃないこと
    assert.ok(id !== null && id !== undefined, "idが空です");
    assert.ok(args.name !== null && args.name !== undefined, "表示名が空です");
    assert.ok(args.sortColumns !== null && args.sortColumns !== undefined, "ソートカラムが空です");
    assert.ok(args.mainColumn !== null && args.mainColumn !== undefined, "メインカラムが空です");
    assert.ok(args.relatedCellsDisplaySettings !== null && args.relatedCellsDisplaySettings !== undefined, "関連セル表示形式が空です");

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
    this._relatedCellsDisplaySettings = args.relatedCellsDisplaySettings;
  }

  static isValidSortColumnLength(length: number): boolean {
    return this.MIN_SORT_COLUMN_LENGTH <= length && length <= this.MAX_SORT_COLUMN_LENGTH;
  }

  static fromJSON(json): DisplaySetting {
    return new DisplaySetting({
      id: json.id,
      name: new TrimedFilledString(json.name),
      sortColumns: json.sortColumns,
      mainColumn: json.mainColumn,
      relatedCellsDisplaySettings: json.relatedCellsDisplaySettings.map(relatedCellsDisplaySetting => {
        return RelatedCellsDisplaySetting.fromJSON(relatedCellsDisplaySetting)
      }),
    })
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name.toString(),
      sortColumns: this._sortColumns,
      mainColumn: this._mainColumn,
      relatedCellsDisplaySettings: this._relatedCellsDisplaySettings,
    }
  }

  removeSpecificColumnAssociatedItem(removedColumnId: string): DisplaySetting {

    return new DisplaySetting({
      id: this._id,
      name: this._name,
      // ソートカラムから対象カラムを削除
      sortColumns: this._sortColumns.filter(sortColumn => sortColumn !== removedColumnId),
      mainColumn: this._mainColumn,
      // 関連セルペインで使うカラムからも対象カラムを削除
      relatedCellsDisplaySettings: this._relatedCellsDisplaySettings.filter(relatedCellsDisplaySetting => {
        return relatedCellsDisplaySetting.columnId !== removedColumnId
      }),
    });
  }

}
