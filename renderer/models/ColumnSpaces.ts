import { TrimedFilledString } from "../value-objects/TrimedFilledString";
import { Columns } from "./Columns";
import { ColumnSpace } from "./ColumnSpace";

interface ColumnSpacesConstructorArgs {
  children: ColumnSpace[],
}

/*// TODO 以下をまとめる
  ただしsがつかないやつはRelatedCell以外はエンティティだと思う。プログラム上でもミュータブルにするかどうかは、一般的にはするのかな。プログラム上ではイミュータブルにしてもいいらしいけどまあおまかせで。
*/
export class ColumnSpaces {

  children: ColumnSpace[];

  constructor(args?: ColumnSpacesConstructorArgs) {
    //TODO: 不変条件
    this.children = (args == undefined) ? [] : args.children;
  }

  addColumnSpace(columnSpace: ColumnSpace): ColumnSpaces {  //TODO: 失敗したら例外出す リポジトリ側かな？
    this.children.push(columnSpace);
    return this;
  }

  static fromJSON(json) {
    return new ColumnSpaces({
      children: json.map((columnSpace) => new ColumnSpace({
        id: columnSpace.id,
        name: new TrimedFilledString(columnSpace.name),
        childColumnSpaces: ColumnSpaces.fromJSON(columnSpace.childColumnSpaces),
        columns: Columns.fromJSON(columnSpace.columns),
      }))
    });
  }

  toJSON(key) {
    return this.children;
  }

  // 子孫のカラムスペースから指定IDのものを探して返す
  findDescendantColumnSpace(targetId: string): ColumnSpace {
    for (let i=0; i<this.children.length; i++) {
      if (this.children[i].id === targetId) {
        return this.children[i];
      }
      const columnSpace = this.children[i].childColumnSpaces.findDescendantColumnSpace(targetId);
      if (columnSpace) {
        return columnSpace;
      }
    }
  }

  // 子のカラムスペースから指定IDのものを削除
  removeChildColumnSpace(targetId: string): ColumnSpaces {
    for (let i=0; i<this.children.length; i++) {
      if (this.children[i].id === targetId) {
        this.children.splice(i, 1);
        return this;
      }
    }
  }

  // 子孫のカラムスペースから指定IDのものを削除
  removeDescendantColumnSpace(targetId: string): ColumnSpaces {
    for (let i=0; i<this.children.length; i++) {
      if (this.children[i].id === targetId) {
        return this.removeChildColumnSpace(targetId);
      }
      this.children[i].childColumnSpaces.removeDescendantColumnSpace(targetId);
    }
    return this;
  }

  // 子に新規カラムスペースを追加
  addChildColumnSpace(columnSpace: ColumnSpace): ColumnSpaces {
    this.children.push(columnSpace);
    return this;
  }

  // 子孫のカラムスペースに指定カラムスペースを追加
  addDescendantColumnSpace(immigrant: ColumnSpace, toId: string): ColumnSpaces {
    for (let i=0; i<this.children.length; i++) {
      if (this.children[i].id === toId) {
        this.children[i].childColumnSpaces = this.children[i].childColumnSpaces.addChildColumnSpace(immigrant);
        return new ColumnSpaces({
          children: this.children
        });
      }
      this.children[i].childColumnSpaces.addDescendantColumnSpace(immigrant, toId);
    }
    return this;
  }

  // 指定IDのカラムスペースを、指定IDのカラムスペース配下に移動
  moveDescendantColumnSpace(id: string, toId: string): ColumnSpaces {
    if (!this.canMoveDescendantColumnSpace(id, toId)) {
      throw new Error("例外の設計は後で…、、、ひとまず例外");
    }
    const immigrant = this.findDescendantColumnSpace(id);
    const newColumnSpaces = this.removeDescendantColumnSpace(id);
    return newColumnSpaces.addDescendantColumnSpace(immigrant, toId);
  }

  // 指定IDのカラムスペースを、指定IDのカラムスペース配下に移動可能か
  canMoveDescendantColumnSpace(id: string, toId: string): boolean {
    const isSame: boolean = (id === toId);
    if (isSame) {
      return false;
    }

    const toColumnSpace = this.findDescendantColumnSpace(toId);
    if (!toColumnSpace || toColumnSpace.hasColumns()) {
      return false;
    }

    const columnSpace = this.findDescendantColumnSpace(id);
    if (!columnSpace) {
      return false;
    }

    return true;
  }

}