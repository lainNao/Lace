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

  id: string;
  name: TrimedFilledString;
  type: ColumnDataType;
  cells: Cells;

  constructor(args: ColumnConstructorArgs) {
    const id = args.id ?? uuidv4();

    //TODO 不変条件、あといろいろ入れる

    this.id = id;
    this.name = args.name;
    this.type = args.type;
    this.cells = args.cells;
  }

}