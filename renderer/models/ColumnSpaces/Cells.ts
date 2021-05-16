import { Cell } from "./Cell";

interface CellsConstructorArgs {
  children: Cell[],
}

export class Cells {

  private _children: Cell[];

  get children(): Cell[] { return this._children }

  constructor(args?: CellsConstructorArgs) {
    this._children = (args == null) ? [] : args.children;
  }

  addCell(cell: Cell): void {  //TODO: 失敗したら例外出す
    this.children.push(cell);
  }

  static fromJSON(json) {
    return new Cells({
      children: json.map((cell) => Cell.fromJSON({
        id: cell.id,
        data: cell.data,
        type: cell.type,
      })
    )});
  }

  toJSON() {
    return this._children;
  }

  mapChildren(callback: (value: Cell, index: number, array: Cell[]) => unknown): unknown[]  {
    return this._children.map(callback);
  }
}
