import { array_move } from "../modules/array";
import { TrimedFilledString } from "../value-objects/TrimedFilledString";
import { Column } from "./Column";

interface ColumnsConstructorArgs {
  children: Column[],
}

export class Columns {
  private children: Column[];

  constructor(args?: ColumnsConstructorArgs) {
    this.children = (args == undefined) ? [] : args.children;
  }

  static fromJSON(json) {
    return new Columns({
      children: json.map((column) => new Column({
        id: column.id,
        name: new TrimedFilledString(column.name),
        type: column.type,
        cells: column.cells,
      })
    )});
  }

  mapChildren(callback: (value: Column, index: number, array: Column[]) => unknown): unknown[]  {
    return this.children.map(callback);
  }

  push(column: Column): Columns {
    this.children.push(column);
    return this;
  }

  toJSON(key) {
    return this.children;
  }

  findIndexOf(columnId: string): number {
    return this.children.findIndex((column) => column.id === columnId);
  }

  moveColumnFromTo(fromIndex: number, toIndex: number): Columns {
    this.children = array_move(this.children, fromIndex, toIndex);
    return this;
  }

  // カラムを持っているか
  hasColumns(): boolean {
    return this.children.length > 0;
  }

}