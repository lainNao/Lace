import { v4 as uuidv4 } from 'uuid';
import { TrimedFilledString } from "../../value-objects/TrimedFilledString";
import { RelatedCellsDisplaySetting } from ".";

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
  get name() { return this._name; }
  get sortColumns() { return this._sortColumns; }
  get mainColumn() { return this._mainColumn; }
  get relatedCellsDisplaySettings() { return this._relatedCellsDisplaySettings; }

  static get MIN_SORT_COLUMN_LENGTH() { return 1; }
  static get MAX_SORT_COLUMN_LENGTH() { return 5; }

  constructor(args: ConstructorArgs) {
    const id = args.id ?? uuidv4();
    //TODO 不変条件

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
      relatedCellsDisplaySettings: json.relatedCellsDisplaySettings?.map(displaySetting => {
        return new RelatedCellsDisplaySetting(displaySetting);
      }),
    })
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      sortColumns: this._sortColumns,
      mainColumn: this._mainColumn,
      relatedCellsDisplaySettings: this._relatedCellsDisplaySettings,
    }
  }

}
