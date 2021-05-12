import { RelatedCells } from "./RelatedCells";

interface CellConstructorArgs {
  id?: string,
  path: string,
  type: any, //TODO
  relatedCells: RelatedCells,
}

export class Cell {
  private _id: string;
  private _path: string; //TODO
  private _type: any; //TODO
  private _relatedCells: RelatedCells;

  constructor(props: CellConstructorArgs) {
    //TODO 不変条件  IDは生成する

    const id = props.id;
    this._id = id;
    //TODO pathとかどうするか。データタイプごとに違うからポリモーフィズムしたい
    this._type = props.type;
    this._relatedCells = props.relatedCells;
  }

  get id() { return this._id; }
  get path() { return this._path; }
  get type() { return this._type; }
  get relatedCells() { return this._relatedCells; }

  toJSON() {
    return {
      id: this._id,
      path: this.path,
      type: this._type,
      relatedCells: this._relatedCells,
    }
  }

}