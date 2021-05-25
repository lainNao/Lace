import { v4 as uuidv4 } from 'uuid'
import { CellDataType } from "../../resources/CellDataType";
import { TrimedFilledString } from '../../value-objects/TrimedFilledString';
import { Cell, Cells } from '.';

interface ColumnConstructorArgs {
  id?: string,
  name: TrimedFilledString,
  type: CellDataType,
  cells: Cells,
}

interface FromJsonArgs {
  id: string,
  name: string,
  type: string,
  cells: string,
}

export class Column {

  private _id: string;
  private _name: TrimedFilledString;
  private _type: CellDataType;
  private _cells: Cells;

  get id() { return this._id; }
  get name() { return this._name.toString(); }
  get type() { return this._type; }
  get cells() { return this._cells; }

  constructor(args: ColumnConstructorArgs) {
    const id = args.id ?? uuidv4();

    //TODO 不変条件、あといろいろ入れる

    this._id = id;
    this._name = args.name;
    this._type = args.type;
    this._cells = args.cells;
  }

  static fromJSON(json: FromJsonArgs) {
    return new Column({
      id: json.id,
      name: new TrimedFilledString(json.name),
      type: CellDataType[json.type],
      cells: Cells.fromJSON(json.cells),
    });
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      type: this._type,
      cells: this._cells,
    }
  }

  mapCells(callback: (value: Cell, index: number, array: Cell[]) => unknown): unknown[]  {
    return this._cells.mapChildren(callback);
  }

  findCell(targetCellId: string): Cell {
    return this._cells.findCell(targetCellId);
  }

  addCells(cells: Cells): Column {
    this._cells.merge(cells);
    return this;
  }

  addCell(cell: Cell): Column {
    this._cells.addCell(cell);
    return this;
  }

  updateCell(cell: Cell): Column {
    this._cells.updateCell(cell);
    return this;
  }

  removeCell(cellId: string): Column {
    this._cells.removeCell(cellId);
    return this;
  }

}