import { Cell, Cells, Column, ColumnSpace } from ".";

interface ColumnSpacesConstructorArgs {
  children: ColumnSpace[],
}

/*// TODO 以下をまとめる
  ただしsがつかないやつはRelatedCell以外はエンティティだと思う。プログラム上でもミュータブルにするかどうかは、一般的にはするのかな。プログラム上ではイミュータブルにしてもいいらしいけどまあおまかせで。
*/
export class ColumnSpaces {

  private _children: ColumnSpace[];

  get children(): ColumnSpace[] { return this._children; }

  constructor(args?: ColumnSpacesConstructorArgs) {
    this._children = (args == null) ? [] : args.children;
  }

  static fromJSON(json) {
    return new ColumnSpaces({
      children: json.map((columnSpaceJson) => ColumnSpace.fromJSON({
        id: columnSpaceJson.id,
        name: columnSpaceJson.name,
        childColumnSpaces: columnSpaceJson.childColumnSpaces,
        columns: columnSpaceJson.columns,
      }))
    });
  }

  toJSON() {
    return this._children;
  }

  mapChildren(callback: (value: ColumnSpace, index: number, array: ColumnSpace[]) => unknown): unknown[]  {
    return this._children.map(callback);
  }

  // 子孫のカラムスペースから指定IDのものを探して返す
  findDescendantColumnSpace(targetColumnSpaceId: string): ColumnSpace {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === targetColumnSpaceId) {
        return this._children[i];
      }
      const columnSpace = this._children[i].findDescendantColumnSpace(targetColumnSpaceId);
      if (columnSpace) {
        return columnSpace;
      }
    }
  }

  findDescendantColumn(targetColumnId: string): Column {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].findDescendantColumn(targetColumnId)) {
        return this._children[i].findDescendantColumn(targetColumnId);
      }
    }
  }

  // 子のカラムスペースから指定IDのものを削除
  removeChildColumnSpace(targetColumnSpaceId: string): ColumnSpaces {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === targetColumnSpaceId) {
        this._children.splice(i, 1);
        return this;
      }
    }
    // TODO これはここに例外出す処理書きやすいな。でも他のそういうことしづらいやつのとの兼ね合いも含めやるかやらないか、やるならどうやるか後で考えて
  }

  // 子孫のカラムスペースから指定IDのものを削除
  removeDescendantColumnSpace(targetColumnSpaceId: string): ColumnSpaces {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === targetColumnSpaceId) {
        return this.removeChildColumnSpace(targetColumnSpaceId);
      }
      this._children[i].removeDescendantColumnSpace(targetColumnSpaceId);
    }
    return this;
  }

  // 子孫のカラムから指定IDのものを削除（これ、カラムスペースID必要にしてよかったのでは）
  removeDescendantColumn(targetColumnId: string): ColumnSpaces {
    //TODO　これ、一個もtrue返すの無かった場合throw Errorしたらよいのでは　→やってみたけどネストしてる時にもエラー出すから駄目だった。ネストしてるからいちいちエラー出せないんだよな…消せなかった判定どうしようか後で考えたい
    for (let i=0; i<this._children.length; i++) {
      this._children[i].removeDescendantColumn(targetColumnId);
    }
    return this;
  }

  removeDescendantCell(columnSpaceId: string, columnId: string, cellId: string): ColumnSpaces {
    for (let i=0; i<this._children.length; i++) {
      this._children[i].removeDescendantCell(columnSpaceId, columnId, cellId);
    }
    return this;
  }

  // 子に新規カラムスペースを追加
  push(columnSpace: ColumnSpace): ColumnSpaces {
    this._children.push(columnSpace);
    return this;
  }

  updateFileDirectory(oldUserDirectory: string, newUserDirectory: string): ColumnSpaces {
    const json = JSON.stringify(this);
    const reJson = JSON.parse(json.replaceAll(
      JSON.stringify(oldUserDirectory).slice(1,-1),
      JSON.stringify(newUserDirectory).slice(1,-1),
    ));
    return ColumnSpaces.fromJSON(reJson);
  }

  // 子孫のカラムスペースを上書き（同じIDのものを探して上書き）
  updateDescendantColumnSpace(columnSpace: ColumnSpace): ColumnSpaces {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === columnSpace.id) {
        this._children[i] = columnSpace;
        return this;
      }
      this._children[i].updateDescendantColumnSpace(columnSpace);
    }
    return this;
  }

  // 子孫のカラムを上書き（同じIDのものを探して上書き）
  //TODO これ、カラムスペースも引数でもらってよかったのでは
  updateDescendantColumn(column: Column): ColumnSpaces {
    //TODO　これ、一個もtrue返すの無かった場合throw Errorしたらよいのでは　→やってみたけどネストしてる時にもエラー出すから駄目だった。ネストしてるからいちいちエラー出せないんだよな…消せなかった判定どうしようか後で考えたい
    for (let i=0; i<this._children.length; i++) {
      this._children[i].updateDescendantColumn(column);
    }
    return this;
  }

  // 子孫のセルを上書き（同じIDのものを探して上書き）
  updateDescendantCell(columnSpaceId: string, columnId: string, cell: Cell) : ColumnSpaces {
    for (let i=0; i<this._children.length; i++) {
      this._children[i].updateDescendantCell(columnSpaceId, columnId, cell);
      if (this._children[i].id === columnSpaceId) {
        return this;
      }
    }
    return this;
  }

  // 子孫のカラムスペースに指定カラムスペースを追加
  addDescendantColumnSpace(columnSpace: ColumnSpace, targetColumnSpaceId: string): ColumnSpaces {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === targetColumnSpaceId) {
        this._children[i].addChildColumnSpace(columnSpace);
        return this;
      }
      this._children[i].addDescendantColumnSpace(columnSpace, targetColumnSpaceId);
    }
    return this;
  }

  // 子孫のカラムスペースに指定カラムを追加
  addDescendantColumn(column: Column, targetColumnSpaceId: string): ColumnSpaces {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === targetColumnSpaceId) {
        this._children[i].addColumn(column);
        return this;
      }
      this._children[i].addDescendantColumn(column, targetColumnSpaceId);
    }
    return this;
  }

  // 子孫のカラムスペース、カラムに指定Cellsを追加
  addDescendantCells(cells: Cells, targetColumnSpaceId: string, targetColumnId: string): ColumnSpaces {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === targetColumnSpaceId) {
        this._children[i].addCellsTo(cells, targetColumnId);
        return this;
      }
      this._children[i].addDescendantCells(cells, targetColumnSpaceId, targetColumnId);
    }
    return this;
  }

  // 子孫のカラムスペース、カラムに指定Cellを追加
  addDescendantCell(cell: Cell, targetColumnSpaceId: string, targetColumnId: string): ColumnSpaces {
    for (let i=0; i<this._children.length; i++) {
      if (this._children[i].id === targetColumnSpaceId) {
        this._children[i].addCellTo(cell, targetColumnId);
        return this;
      }
      this._children[i].addDescendantCell(cell, targetColumnSpaceId, targetColumnId);
    }
    return this;
  }

  // 指定IDのカラムスペースを、トップレベルのカラムスペース配下に移動
  moveColumnSpaceToTopLevel(targetColumnSpaceId: string): ColumnSpaces {
    if (!this.canMoveColumnSpaceToTopLevel(targetColumnSpaceId)) {
      throw new Error("移動できません");
    }
    const immigrant = this.findDescendantColumnSpace(targetColumnSpaceId);
    const newColumnSpaces = this.removeDescendantColumnSpace(targetColumnSpaceId);
    return newColumnSpaces.push(immigrant);
  }

  // 指定IDのカラムスペースを、指定IDのカラムスペース配下に移動
  moveDescendantColumnSpace(columnSpaceId: string, targetColumnSpaceId: string): ColumnSpaces {
    if (!this.canMoveDescendantColumnSpace(columnSpaceId, targetColumnSpaceId)) {
      throw new Error("移動できません");
    }
    const immigrant = this.findDescendantColumnSpace(columnSpaceId);
    const newColumnSpaces = this.removeDescendantColumnSpace(columnSpaceId);
    return newColumnSpaces.addDescendantColumnSpace(immigrant, targetColumnSpaceId);
  }

  // 指定IDのカラムスペースを、指定IDのカラムスペース配下に移動可能か
  canMoveColumnSpaceToTopLevel(columnSpaceId: string): boolean {

    // カラムスペースとして取得できない場合はもちろん移動できない
    const columnSpace = this.findDescendantColumnSpace(columnSpaceId);
    if (!columnSpace) {
      return false;
    }

    return true;
  }

  // 指定IDのカラムスペースを、指定IDのカラムスペース配下に移動可能か
  canMoveDescendantColumnSpace(columnSpaceId: string, targetColumnSpaceId: string): boolean {
    // 自分と相手が同じなら移動できない
    const isSame: boolean = (columnSpaceId === targetColumnSpaceId);
    if (isSame) {
      return false;
    }

    // カラムを持っている相手には移動できない
    const toColumnSpace = this.findDescendantColumnSpace(targetColumnSpaceId);
    if (!toColumnSpace || toColumnSpace.hasColumns()) {
      return false;
    }

    // カラムスペースとして取得できない場合はもちろん移動できない
    // NOTE: この本質的な判定をメソッドの一番上に持ってこないのは検索コスト削減のため
    const columnSpace = this.findDescendantColumnSpace(columnSpaceId);
    if (!columnSpace) {
      return false;
    }

    return true;
  }

  // 子カラムを追加できるかどうか
  canAddColumn(): boolean {
    return this._children.length === 0;
  }

  // 子カラムスペースを持つかどうか
  hasChildColumnSpace(): boolean {
    return this._children.length > 0;
  }

}