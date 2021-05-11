import { v4 as uuidv4 } from 'uuid'
import { TrimedFilledString } from '../value-objects/TrimedFilledString';
import { Column } from './Column';
import { Columns } from './Columns';
import { ColumnSpaces } from './ColumnSpaces';

interface ColumnSpaceConstructorArgs {
  id?: string,
  name: TrimedFilledString,
  childColumnSpaces: ColumnSpaces,
  columns: Columns,
}

export class ColumnSpace {

  private _id: string;
  private _name: TrimedFilledString;
  private _childColumnSpaces: ColumnSpaces;
  private _columns: Columns;

  constructor(args: ColumnSpaceConstructorArgs) {
    const id = args.id ?? uuidv4();
    //TODO 既に同じIDが存在するか確認（そこまでする必要ある？保存時に確認…？うーん）。他各種不変条件

    this._id = id;
    this._name = args.name;
    this._childColumnSpaces = args.childColumnSpaces;
    this._columns = args.columns;
  }

  get id() { return this._id; }
  get name() { return this._name.value; }
  get childColumnSpaces() {return this._childColumnSpaces; }
  get columns() { return this._columns; }

  toJSON(key) {
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

  addDescendantColumnSpace(columnSpace: ColumnSpace, toId: string): ColumnSpace {
    this._childColumnSpaces.addDescendantColumnSpace(columnSpace, toId);
    return this;
  }

  addDescendantColumn(column: Column, toId: string) {
    this._childColumnSpaces.addDescendantColumn(column, toId);
    return this;
  }

  updateDescendantColumnSpace(columnSpace: ColumnSpace): ColumnSpaces {
    return this._childColumnSpaces.updateDescendantColumnSpace(columnSpace);
  }

  removeDescendantColumnSpace(targetId: string): ColumnSpaces {
    return this._childColumnSpaces.removeDescendantColumnSpace(targetId);
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