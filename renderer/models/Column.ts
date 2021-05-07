import { v4 as uuidv4 } from 'uuid'
import { TrimedFilledString } from '../value-objects/TrimedFilledString';
import { Cells } from './Cells';

interface ColumnConstructorArgs {
  id?: string,
  name: TrimedFilledString,
  type: any, //TODO(enum)
  collapsable: any, //TODO(bool)
  cells: Cells, //TODO
}

export class Column {

  id: string;
  name: TrimedFilledString;
  type: any; //TODO(enum)
  collapsable: any; //TODO(bool)
  cells: Cells; //TODO

  constructor(args: ColumnConstructorArgs) {
    const id = args.id ?? uuidv4();

    //TODO 不変条件、あといろいろ入れる

    this.id = id;
    this.name = args.name;
    this.type = "file"; //TODO 後でenum化
    this.collapsable = args.collapsable;
    this.cells = args.cells;
  }

}