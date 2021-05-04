import { Column } from "./Column";

interface ColumnsConstructorArgs {
  children: Column[]
}

export class Columns {
  children: Column[];

  constructor(args?: ColumnsConstructorArgs) {
    //todo: 不変条件
    this.children = (args == undefined) ? [] : args.children;
  }

  static fromJson(json) {
    return new Columns({
      children: json.map((column) => new Column({
        id: column.id,
        name: column.name,
        type: column.type,
        collapsable: column.collapsable,
        data: column.data,
      })
    )});
  }

    //todo toJson

}