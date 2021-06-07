import { assert } from "console";

interface ConstructorArgs {
  columnId: string,
  direction: RelatedCellDisplayDirectionType,
  hListDisplayType?: HListDisplayType,
  hListSeparator?: string,
}

export enum RelatedCellDisplayDirectionType {
  Vertical = "Vertical",
  Horizontal = "Horizontal",
}

export enum HListDisplayType {
  Plain = "Plain",
  Tag = "Tag",
}

export class RelatedCellsDisplaySetting {

  private _columnId: string;
  private _direction: RelatedCellDisplayDirectionType;
  // 以下はHList時のみ
  private _hListDisplayType?: HListDisplayType
  private _hListSeparator?: string;

  get columnId() { return this._columnId; }
  get direction() { return this._direction; }
  get hListDisplayType() { return this._hListDisplayType; }
  get hListSeparator() { return this._hListSeparator; }

  constructor(args: ConstructorArgs) {
    assert(args.columnId !== null || args.columnId !== undefined, "columnIdが空です");
    assert(args.direction !== null || args.direction !== undefined, "directionが空です");

    this._columnId = args.columnId;
    this._direction = args.direction;
    this._hListDisplayType = args.hListDisplayType;
    this._hListSeparator = args.hListSeparator;
  }

  static fromJSON(json): RelatedCellsDisplaySetting {
    return new RelatedCellsDisplaySetting({
      columnId: json.columnId,
      direction: RelatedCellDisplayDirectionType[json.direction],
      hListDisplayType: HListDisplayType[json.hListDisplayType],
      hListSeparator: json.hListSeparator,
    });
  }

  toJSON() {
    return {
      columnId: this._columnId,
      direction: this._direction,
      hListDisplayType: this.hListDisplayType,
      hListSeparator: this.hListSeparator,
    }
  }

}