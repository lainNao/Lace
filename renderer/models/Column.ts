import { v4 as uuidv4 } from 'uuid'
import { ColumnDataType } from '../enums/app';
import { TrimedFilledString } from '../value-objects/TrimedFilledString';
import { Cells } from './Cells';

interface ColumnConstructorArgs {
  id?: string,
  name: TrimedFilledString,
  type: ColumnDataType,
  cells: Cells,
}

export class Column {

  private _id: string;
  private _name: TrimedFilledString;
  private _type: ColumnDataType;
  private _cells: Cells;

  constructor(args: ColumnConstructorArgs) {
    const id = args.id ?? uuidv4();

    //TODO 不変条件、あといろいろ入れる

    this._id = id;
    this._name = args.name;
    this._type = args.type;
    this._cells = args.cells;
  }

  get id() { return this._id; }
  get name() { return this._name.toString(); }
  get type() { return this._type; } //TODO ここ「.value()」とかにしなくて可？
  get cells() { return this._cells; }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      type: this._type,
      cells: this._cells,
    }
  }

}