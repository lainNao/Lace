import { v4 as uuidv4 } from 'uuid';
import { CellDataFactory } from '../../factories/CellDataFactory';
import { CellDataType } from '../../resources/CellDataType';
import { CellData } from './CellData';

interface CellConstructorArgs {
  id?: string,
  data: CellData,
  type: CellDataType,
}

interface FromJSONArgs {
  id: string,
  data: string,
  type: string,
};

export class Cell {
  private _id: string;
  private _data: CellData;
  private _type: CellDataType;

  get id() { return this._id; }
  get data() { return this._data; }
  get type() { return this._type; } //TODO ここ「.value()」とかにしなくて可？

  constructor(args: CellConstructorArgs) {
    //TODO 不変条件
    const id = args.id ?? uuidv4();

    this._id = id;
    this._data = args.data;
    this._type = args.type;
  }

  static fromJSON(json: FromJSONArgs) {
    return new Cell({
      id: json.id,
      data: CellDataFactory.create(CellDataType[json.type], json.data),
      type: CellDataType[json.type],
    });
  }

  toJSON() {
    return {
      id: this._id,
      data: this._data,
      type: this._type,
    }
  }

}