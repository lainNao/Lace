import { TrimedFilledString } from "../value-objects/TrimedFilledString";
import { Column } from "./Column";

interface ColumnsConstructorArgs {
  children: Column[],
}

export class Columns {
  children: Column[];

  constructor(args?: ColumnsConstructorArgs) {
    //TODO: 不変条件
    this.children = (args == undefined) ? [] : args.children;
  }

  static fromJSON(json) {
    return new Columns({
      children: json.map((column) => new Column({
        id: column.id,
        name: new TrimedFilledString(column.name),
        type: column.type,
        collapsable: column.collapsable,
        cells: column.cells,
      })
    )});
  }

  toJSON(key) {
    return this.children;
  }

}