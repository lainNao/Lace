import { TrimedFilledString } from "../value-objects/TrimedFilledString";
import { Columns } from "./Columns";
import { ColumnSpace } from "./ColumnSpace";

interface ColumnSpacesConstructorArgs {
  children: ColumnSpace[],
}

// TODO ミュータブルなのかイミュータブルなのか曖昧な扱いしてるな。新しいインスタンスを返していても、古いのは変更しちゃっていたり。どっちかにしたほうがいい。方針調べて書き直して。
/*// TODO 以下をまとめる
  というか「～s」のシリーズはファーストクラスコレクション的なものであって、IDも何も無いしエンティティではない気がする
  バリューオブジェクトとも言えるけど、別に同一性を比較することは無い
  なのでそこらへん、イミュータブルとかミュータブルとかは特に制限無くて、使いやすい方にするのが解でいい気がする。あとでまとめて…
    どっちかと言えばイミュータブルのほうがプライオリティ高い気がする。なぜなら「newColumnSpaces」的な変数にまた代入できるから（それにそんなに細々とした代入しないから問題置きないだろうし）
      ただCPU負担は出るので、そんなに好み的に違いがないならミュータブルにしといたほうがいい。考えておく…。
        というかイミュータブル風に扱ってるremove～も結局ミューテーションしちゃってるから、もうミュータブルな方向でいい気がする。いちいちイミュータブルな処理に書き直すの、今回ばかりは怠い気がする。
          とりあえずミュータブルで、戻値はthisを返すようにした
        いや別に一度cloneすればミュータブルな処理にもできたけど、それでもちょっと書き直す必要あるし、なおかつCPU負担もあるので、そこまでイミュータブルである必要性も無いクラスだしってことでメモっておいてあとで
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
  // TODO 失敗したら例外（もしかして再帰的な構造だから無理？無理っぽいので代案考えておく…渡されたidの要素が無い場合でもちゃんと自身を返すからエラーなのかエラーじゃないのか判別つかないんだよな…フラグを使うしかないかな、。他のメソッドでも同じことなってそうなので後で確認）
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