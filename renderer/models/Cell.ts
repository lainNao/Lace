import { RelatedCells } from "./RelatedCells";

export class Cell {
  id: string;
  path: string;
  name: string;
  type: any; //TODO
  relatedCells: RelatedCells;

  constructor(props) {
    //TODO 不変条件
    const id = props.id;
    this.id = id;
    // this.name = props.name;
    this.type = props.type;
    this.relatedCells = props.relatedCells;
  }

}