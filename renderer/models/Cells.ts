import { Cell } from "./Cell";

export class Cells {

  children: Cell[];

  constructor(args?) {
    //todo: 不変条件
    this.children = (args == undefined) ? [] : args.children;
  }

  addCell(cell: Cell): void {  //todo: 失敗したら例外出す
    this.children.push(cell);
  }

  static fromJson(json) {
    return new Cells({
      children: json.map((cell) => new Cell({  //todo ここはポリモーフィズムやる
        id: cell.id,
        // path: cell.path,
        // name: cell.name,
        // type: cell.type,
        relatedCells: cell.relatedCells
      })
    )});
  }

}
