import { Columns } from "./Columns";
import { ColumnSpace } from "./ColumnSpace";

interface ColumnSpacesConstructorArgs {
  children: ColumnSpace[],
}

export class ColumnSpaces {

  children: ColumnSpace[];

  constructor(args?: ColumnSpacesConstructorArgs) {
    //todo: 不変条件
    this.children = (args == undefined) ? [] : args.children;
  }

  addColumnSpace(columnSpace: ColumnSpace): void {  //todo: 失敗したら例外出す
    this.children.push(columnSpace);
  }

  static fromJson(json) {
    return new ColumnSpaces({
      children: json.map((columnSpace) => new ColumnSpace({
        id: columnSpace.id,
        name: columnSpace.name,
        childColumnSpaces: ColumnSpaces.fromJson(columnSpace.childColumnSpaces),
        columns: Columns.fromJson(columnSpace.columns),
      }))
    });
  }

  toJSON(key) {
    return this.children;
  }

}