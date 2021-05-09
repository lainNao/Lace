import { TrimedFilledString } from "../value-objects/TrimedFilledString";
import { Column } from "./Column";
import { Columns } from "./Columns";
import { ColumnSpace } from "./ColumnSpace";

interface ColumnSpacesConstructorArgs {
  children: ColumnSpace[],
}

/*// TODO 以下をまとめる
  ただしsがつかないやつはRelatedCell以外はエンティティだと思う。プログラム上でもミュータブルにするかどうかは、一般的にはするのかな。プログラム上ではイミュータブルにしてもいいらしいけどまあおまかせで。
*/
export class ColumnSpaces {

  private children: ColumnSpace[];

  constructor(args?: ColumnSpacesConstructorArgs) {
    this.children = (args == undefined) ? [] : args.children;
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

  mapChildren(callback: (value: ColumnSpace, index: number, array: ColumnSpace[]) => unknown): unknown[]  {
    return this.children.map(callback);
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
  push(columnSpace: ColumnSpace): ColumnSpaces {
    this.children.push(columnSpace);
    return this;
  }

  // 子孫のカラムスペースを上書き
  updateDescendantColumnSpace(columnSpace: ColumnSpace): ColumnSpaces {
    for (let i=0; i<this.children.length; i++) {
      if (this.children[i].id === columnSpace.id) {
        this.children[i] = columnSpace;
        return this;
      }
      this.children[i].childColumnSpaces.updateDescendantColumnSpace(columnSpace);
    }
    return this;
  }

  // 子孫のカラムスペースに指定カラムスペースを追加
  addDescendantColumnSpace(columnSpace: ColumnSpace, toId: string): ColumnSpaces {
    for (let i=0; i<this.children.length; i++) {
      if (this.children[i].id === toId) {
        this.children[i].childColumnSpaces = this.children[i].childColumnSpaces.push(columnSpace);
        return this;
      }
      this.children[i].childColumnSpaces.addDescendantColumnSpace(columnSpace, toId);
    }
    return this;
  }

  // 子孫のカラムスペースに指定カラムを追加
  addDescendantColumn(column: Column, toId: string): ColumnSpaces {
    for (let i=0; i<this.children.length; i++) {
      if (this.children[i].id === toId) {
        this.children[i].addColumn(column);
        return this;
      }
      this.children[i].childColumnSpaces.addDescendantColumn(column, toId);
    }
    return this;
  }

  // 指定IDのカラムスペースを、指定IDのカラムスペース配下に移動
  moveDescendantColumnSpace(id: string, toId: string): ColumnSpaces {
    if (!this.canMoveDescendantColumnSpace(id, toId)) {
      throw new Error("移動できません");
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