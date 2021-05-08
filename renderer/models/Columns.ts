import { TrimedFilledString } from "../value-objects/TrimedFilledString";
import { Column } from "./Column";

interface ColumnsConstructorArgs {
  children: Column[],
}

export class Columns {
  children: Column[];

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

  push(column: Column): Columns {
    this.children.push(column);
    return this;
  }

  toJSON(key) {
    return this.children;
  }

}