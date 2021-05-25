import { array_move } from "../../modules/array";
import { Cell, Cells, Column } from ".";

interface ColumnsConstructorArgs {
  children: Column[],
}

export class Columns {
  private _children: Column[];

  get children(): Column[] { return this._children }

  constructor(args?: ColumnsConstructorArgs) {
    this._children = (args == null) ? [] : args.children;
  }

  static fromJSON(json) {
    return new Columns({
      children: json.map((column) => Column.fromJSON({
        id: column.id,
        name: column.name,
        type: column.type,
        cells: column.cells,
      })
    )});
  }

  toJSON() {
    return this._children;
  }

  mapChildren(callback: (value: Column, index: number, array: Column[]) => unknown): unknown[]  {
    return this._children.map(callback);
  }

  filterChildren(callback: (value: Column, index: number, array: Column[]) => unknown): unknown[]  {
    return this._children.filter(callback);
  }

  push(column: Column): Columns {
    this._children.push(column);
    return this;
  }

  findChildColumn(targetId: string): Column { //TODO ここらへん、Columnsを返すのかColumnを返すのかいろいろ後で判断する。特にadd類など
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === targetId) {
        return this._children[i];
      }
    }
  }

  findBellowCell(targetCellId: string, targetColumnId: string): Cell {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === targetColumnId) {
        return this._children[i].findCell(targetCellId);
      }
    }
  }

  findIndexOf(columnId: string): number {
    return this.children.findIndex((column) => column.id === columnId);
  }

  addCellsTo(cells: Cells, columnId: string): Columns {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === columnId) {
        this._children[i].addCells(cells);
        return this;
      }
    }
  }

  addCellTo(cell: Cell, columnId: string): Columns {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === columnId) {
        this._children[i].addCell(cell);
        return this;
      }
    }
  }

  moveColumnFromTo(fromIndex: number, toIndex: number): Columns {
    this._children = array_move(this.children, fromIndex, toIndex);
    return this;
  }

  updateColumn(column: Column): Columns {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === column.id) {
        this._children[i] = column;
        return this;
      }
    }
  }

  updateDescendantCell(columnId: string, cell: Cell): Columns {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === columnId) {
        this._children[i].updateCell(cell);
        return this;
      }
    }
  }

  removeColumn(targetId: string): Columns {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === targetId) {
        this._children.splice(i, 1);
        return this;
      }
    }
  }

  removeDecendantCell(columnId: string, cellId: string): Columns {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === columnId) {
        this._children[i].removeCell(cellId);
        return this;
      }
    }
  }

  // カラムを持っているか
  hasColumns(): boolean {
    return this._children.length > 0;
  }

  // 指定のカラムを持っているか
  hasColumn(columnId: string): boolean {
    return this._children.some(column => column.id === columnId);
  }

}