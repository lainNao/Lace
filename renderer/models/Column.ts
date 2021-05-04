import { v4 as uuidv4 } from 'uuid'
import { Cells } from './Cells';

export class Column {

  id: string;
  name: string
  metatype: any; //todo(enum)
  type: any; //todo(enum)
  collapsable: any; //todo(bool)
  cells: Cells; //todo

  constructor(props) {
    const id = props.id ?? uuidv4();

    //todo 不変条件、あといろいろ入れる
    this.id = id;
    this.name = props.name;
    this.metatype = "column";   //todo 後でenum化
    this.type = "file"; //todo 後でenum化
    this.collapsable = props.collapsable;
    this.cells = props.data;
  }

}