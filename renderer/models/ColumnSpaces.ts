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

  static fromJSON(json) {
    return new ColumnSpaces({
      children: json.map((columnSpace) => new ColumnSpace({
        id: columnSpace.id,
        name: columnSpace.name,
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
        return new ColumnSpaces({
          children: this.children
        });
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
    return new ColumnSpaces({
      children: this.children
    });
  }

  // 子孫のカラムスペースに指定カラムスペースを追加
  addDescendantColumnSpace(immigrant: ColumnSpace, toId: string): ColumnSpaces {
    //todo ここにも「子カラムが無いなら」みたいな判定処理いれる？というかここに書いたらビューはその条件書かなくてもよくなるのでは？もしそうなら面白い
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
  // todo バグってるかもなので自動テストやってみて…
  moveDescendantColumnSpace(id: string, toId: string): ColumnSpaces {
    //todo ここにも「子カラムが無いなら」みたいな判定処理いれる？（add～のみでいいとは思うけど曖昧なのでまた後で）
    const immigrant = this.findDescendantColumnSpace(id);
    const newColumnSpaces = this.removeDescendantColumnSpace(id);
    const res = newColumnSpaces.addDescendantColumnSpace(immigrant, toId);
    return res;
  }

}