import { v4 as uuidv4 } from 'uuid'
import { TrimedFilledString } from '../../value-objects/TrimedFilledString';
import { Cell, Cells, Column, Columns, ColumnSpaces } from '.';

interface ColumnSpaceConstructorArgs {
  id?: string,
  name: TrimedFilledString,
  childColumnSpaces: ColumnSpaces,
  columns: Columns,
}

interface FromJsonArgs {
  id: string,
  name: string,
  childColumnSpaces: string,
  columns: string,
}

export class ColumnSpace {

  private _id: string;
  private _name: TrimedFilledString;
  private _childColumnSpaces: ColumnSpaces;
  private _columns: Columns;

  get id() { return this._id; }
  get name() { return this._name.toString(); }
  get childColumnSpaces() {return this._childColumnSpaces; }
  get columns() { return this._columns; }

  constructor(args: ColumnSpaceConstructorArgs) {
    const id = args.id ?? uuidv4();
    //TODO 既に同じIDが存在するか確認（そこまでする必要ある？保存時に確認…？うーん）。他各種不変条件

    this._id = id;
    this._name = args.name;
    this._childColumnSpaces = args.childColumnSpaces;
    this._columns = args.columns;
  }

  static fromJSON(json: FromJsonArgs) {
    return new ColumnSpace({
      id: json.id,
      name: new TrimedFilledString(json.name),
      childColumnSpaces: ColumnSpaces.fromJSON(json.childColumnSpaces),
      columns: Columns.fromJSON(json.columns),
    })
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      childColumnSpaces: this._childColumnSpaces,
      columns: this._columns,
    }
  }

  findDescendantColumnSpace(targetId: string): ColumnSpace {
    return this._childColumnSpaces.findDescendantColumnSpace(targetId);
  }

  findDescendantColumn(targetId: string): Column {
    if (this._columns.hasColumn(targetId)) {
      return this._columns.findChildColumn(targetId);
    }
    return this._childColumnSpaces.findDescendantColumn(targetId);
  }

  findBellowCell(targetCellId: string, targetColumnId: string): Cell {
    return this._columns.findBellowCell(targetCellId, targetColumnId);
  }

  addChildColumnSpace(columnSpace: ColumnSpace): ColumnSpace {  //TODO ここらへんの戻値本当にthisでいいか？全体的に後で勉強して変えるかもなところ
    this._childColumnSpaces.push(columnSpace);
    return this;
  }

  addColumn(column: Column): ColumnSpace {
    if (!this.canAddColumn) {
      throw new Error("カラムの追加ができません");
    }
    this._columns.push(column);
    return this;
  }

  addCellsTo(cells: Cells, columnId: string): ColumnSpace {
    this._columns.addCellsTo(cells, columnId);
    return this;
  }

  addCellTo(cell: Cell, columnId: string): ColumnSpace {
    this._columns.addCellTo(cell, columnId);
    return this;
  }

  addDescendantColumnSpace(columnSpace: ColumnSpace, toId: string): ColumnSpace {
    this._childColumnSpaces.addDescendantColumnSpace(columnSpace, toId);
    return this;
  }

  addDescendantColumn(column: Column, toId: string): ColumnSpace {
    this._childColumnSpaces.addDescendantColumn(column, toId);
    return this;
  }

  addDescendantCells(cells: Cells, columnSpaceId: string, columnId: string): ColumnSpace {
    this._childColumnSpaces.addDescendantCells(cells, columnSpaceId, columnId);
    return this;
  }

  addDescendantCell(cell: Cell, columnSpaceId: string, columnId: string): ColumnSpace {
    this._childColumnSpaces.addDescendantCell(cell, columnSpaceId, columnId);
    return this;
  }

  updateDescendantColumnSpace(columnSpace: ColumnSpace): ColumnSpaces {
    return this._childColumnSpaces.updateDescendantColumnSpace(columnSpace);
  }

  updateDescendantColumn(column: Column): boolean {
    if (this._columns.hasColumn(column.id)) {
      this._columns.updateColumn(column);
    }

    if (this._childColumnSpaces.updateDescendantColumn(column)) {
      return true;
    }

    return false;
  }

  updateDescendantCell(columnSpaceId: string, columnId: string, cell: Cell) : ColumnSpace {
    if (this._id === columnSpaceId) {
      this._columns.updateDescendantCell(columnId, cell);
      return this;
    }
    this._childColumnSpaces.updateDescendantCell(columnSpaceId, columnId, cell);
    return this;
  }

  removeDescendantColumnSpace(targetId: string): ColumnSpaces {
    return this._childColumnSpaces.removeDescendantColumnSpace(targetId);
  }

  removeDescendantColumn(targetId: string): boolean {
    if (this._columns.hasColumn(targetId)) {
      this._columns = this._columns.removeColumn(targetId);
      return true;
    }

    if (this._childColumnSpaces.removeDescendantColumn(targetId)) {
      return true;
    }

    return false;
  }

  removeDescendantCell(columnSpaceId: string, columnId: string, cellId: string): ColumnSpace {
    if (this._columns.hasColumn(columnId)) {
      this._columns = this._columns.removeDecendantCell(columnId, cellId);
      return this;
    }

    this._childColumnSpaces.removeDescendantCell(columnSpaceId, columnId, cellId);
  }

  canAddColumnSpace(): boolean {
    return !this._columns.hasColumns();
  }

  canAddColumn(): boolean {
    return this._childColumnSpaces.canAddColumn();
  }

  hasChildColumnSpace(): boolean {
    return this._childColumnSpaces.hasChildColumnSpace();
  }

  hasColumns(): boolean {
    return this._columns.hasColumns();
  }

}