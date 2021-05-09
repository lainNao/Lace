import { Cell } from "./Cell";

interface CellsConstructorArgs {
  children: Cell[],
}

export class Cells {

  private children: Cell[];

  constructor(args?: CellsConstructorArgs) {
    //TODO: 不変条件
    this.children = (args == undefined) ? [] : args.children;
  }

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

  toJSON(key) {
    return this.children;
  }

  mapChildren(callback: (value: Cell, index: number, array: Cell[]) => unknown): unknown[]  {
    return this.children.map(callback);
  }
}
