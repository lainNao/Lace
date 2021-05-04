import { RelatedCells } from "./RelatedCells";

export class Cell {
  id: string;
  path: string;
  name: string;
  type: any; //todo
  relatedCells: RelatedCells;

  constructor(props) {
    //todo 不変条件
    const id = props.id;
    this.id = id;
    // this.name = props.name;
    this.type = props.type;
    this.relatedCells = props.relatedCells;
  }

  //todo toJson

}