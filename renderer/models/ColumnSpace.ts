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

  id: string;
  name: TrimedFilledString;
  childColumnSpaces: ColumnSpaces;
  columns: Columns;

  constructor(args: ColumnSpaceConstructorArgs) {
    const id = args.id ?? uuidv4();
    //TODO 既に同じIDが存在するか確認（そこまでする必要ある？保存時に確認…？うーん）。他各種不変条件

    this.id = id;
    this.name = args.name;
    this.childColumnSpaces = args.childColumnSpaces;
    this.columns = args.columns;
  }

  addColumn(column: Column): ColumnSpace {
    if (!this.canAddColumn) {
      throw new Error("カラムの追加ができません");
    }
    this.columns.push(column);
    return this;
  }

  canAddColumn(): boolean {
    return this.childColumnSpaces.canAddColumn();
  }

  hasChildColumnSpace(): boolean {
    return this.childColumnSpaces.hasChildColumnSpace();
  }

  hasColumns(): boolean {
    return this.columns.hasColumns();
  }

}