import { Cell } from ".";

interface CellsConstructorArgs {
  children: Cell[],
}

export class Cells {

  private _children: Cell[];

  get children(): Cell[] { return this._children }

  constructor(args?: CellsConstructorArgs) {
    this._children = (args == null) ? [] : args.children;
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


  findCell(targetCellId: string): Cell {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === targetCellId) {
        return this._children[i];
      }
    }
  }


  merge(cells: Cells): void {
    this._children = this._children.concat(cells.children);
  }

  addCell(cell: Cell): void {
    this.children.push(cell);
  }

  updateCell(cell: Cell): Cells {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === cell.id) {
        this._children[i] = cell;
        return this;
      }
    }
  }

  removeCell(cellId: string): Cells {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === cellId) {
        this._children.splice(i, 1);
        return this;
      }
    }
  }

}
