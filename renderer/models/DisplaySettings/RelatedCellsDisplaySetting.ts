import { assert } from "console";
import { DisplayDetailHListSeparator } from ".";
import { DisplayTypeDetailsFactory } from "../../factories/DisplayTypeDetailsFactory";
import { RelatedCellsDisplayType } from "../../resources/RelatedCellsDisplayType";

interface ConstructorArgs {
  type: RelatedCellsDisplayType,
  typeDetails: DisplayDetailHListSeparator,
}

export class RelatedCellsDisplaySetting {

  private _type: RelatedCellsDisplayType;
  private _typeDetails: DisplayDetailHListSeparator;

  get type() { return this._type; }
  get private() { return this._typeDetails; }

  constructor(args: ConstructorArgs) {
    assert(args.type !== null || args.type !== undefined, "typeが空です");

    this._type = args.type;
    this._typeDetails = args.typeDetails;
  }

  static fromJSON(json): RelatedCellsDisplaySetting {
    return new RelatedCellsDisplaySetting({
      type: RelatedCellsDisplayType[json.type],
      typeDetails: DisplayTypeDetailsFactory.create(RelatedCellsDisplayType[json.type], json.typeDetails),
    });
  }

  toJSON() {
    return {
      type: this._type,
      typeDetails: this._typeDetails,
    }
  }

}