import { v4 as uuidv4 } from 'uuid'
import { CellDataType } from "../resources/CellDataType";
import { RelatedPaneDisplayType } from '../resources/RelatedPaneDisplayType';
import { TrimedFilledString } from '../value-objects/TrimedFilledString';
import { Cells } from './Cells';

interface ColumnConstructorArgs {
  id?: string,
  name: TrimedFilledString,
  type: CellDataType,
  cells: Cells,
  relatedPaneDisplayType?: RelatedPaneDisplayType,
}

interface FromJsonArgs {
  id: string,
  name: string,
  type: string,
  cells: string,
  relatedPaneDisplayType?: RelatedPaneDisplayType,
}

export class Column {

  private _id: string;
  private _name: TrimedFilledString;
  private _type: CellDataType;
  private _cells: Cells;
  private _relatedPaneDisplayType: RelatedPaneDisplayType;

  get id() { return this._id; }
  get name() { return this._name.toString(); }
  get type() { return this._type; }
  get cells() { return this._cells; }
  get relatedPaneDisplayType() { return this._relatedPaneDisplayType; }

  constructor(args: ColumnConstructorArgs) {
    const id = args.id ?? uuidv4();

    //TODO 不変条件、あといろいろ入れる

    this._id = id;
    this._name = args.name;
    this._type = args.type;
    this._cells = args.cells;
    this._relatedPaneDisplayType = args.relatedPaneDisplayType;
  }

  static fromJSON(json: FromJsonArgs) {
    return new Column({
      id: json.id,
      name: new TrimedFilledString(json.name),
      type: CellDataType[json.type],
      cells: Cells.fromJSON(json.cells),
      relatedPaneDisplayType: RelatedPaneDisplayType[json.relatedPaneDisplayType],
    });
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      type: this._type,
      cells: this._cells,
      relatedPaneDisplayType: this._relatedPaneDisplayType,
    }
  }

}