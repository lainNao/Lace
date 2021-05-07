import { TrimedFilledString } from "../value-objects/TrimedFilledString";
import { RelatedCells } from "./RelatedCells";

interface CellConstructorArgs {
  id?: string,
  path: string,
  type: any, //TODO
  relatedCells: RelatedCells,
}

export class Cell {
  id: string;
  path: string;
  type: any; //TODO
  relatedCells: RelatedCells;

  constructor(props: CellConstructorArgs) {
    //TODO 不変条件  IDは生成する

    const id = props.id;
    this.id = id;
    this.type = props.type;
    this.relatedCells = props.relatedCells;
  }

}