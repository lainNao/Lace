import { v4 as uuidv4 } from 'uuid'
import { Cells } from './Cells';

export class Column {

  id: string;
  name: string
  type: any; //todo(enum)
  collapsable: any; //todo(bool)
  cells: Cells; //todo

  constructor(args) {
    const id = args.id ?? uuidv4();

    //todo 不変条件、あといろいろ入れる
    this.id = id;
    this.name = args.name;
    this.type = "file"; //todo 後でenum化
    this.collapsable = args.collapsable;
    this.cells = args.cells;
  }

}