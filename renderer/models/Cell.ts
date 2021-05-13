import { v4 as uuidv4 } from 'uuid';
import { RelatedCells } from "./RelatedCells";

interface CellConstructorArgs {
  id?: string,
  relatedCells: RelatedCells,
  data: any,
}

export class Cell {
  private _id: string;
  private _relatedCells: RelatedCells;
  private _data: any;
  //TODO typeフィールドは消しました。Columnが持ってるのを頑張って参照してください。変なことになったら直してください

  constructor(args: CellConstructorArgs) {
    //TODO 不変条件
    const id = args.id ?? uuidv4();

    this._id = id;
    this._data = args.data;
    this._relatedCells = args.relatedCells;
  }

  get id() { return this._id; }
  get data() { return this._data; }
  get relatedCells() { return this._relatedCells; }

  toJSON() {
    return {
      id: this._id,
      data: this._data,
      relatedCells: this._relatedCells,
    }
  }

}