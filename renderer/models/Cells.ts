import { Cell } from "./Cell";

interface CellsConstructorArgs {
  children: Cell[],
}

export class Cells {

  private _children: Cell[];

  constructor(args?: CellsConstructorArgs) {
    //TODO: 不変条件
    this._children = (args == undefined) ? [] : args.children;
  }

  get children(): Cell[] { return this._children }

  addCell(cell: Cell): void {  //TODO: 失敗したら例外出す
    this.children.push(cell);
  }

  static fromJSON(json) {
    return new Cells({
      children: json.map((cell) => new Cell({  //TODO ここはポリモーフィズムやる
        id: cell.id,
        path: cell.path,
        type: cell.type,
        relatedCells: cell.relatedCells
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
