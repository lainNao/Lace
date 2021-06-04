/*TODO
  ドメインイベント方式にしたい。これをimportして、フィールドのlisteners的な配列に突っ込めば発火するようにする。（もちろんこのクラスの場合カラムスペース削除のメソッドの最後あたりに発火するよう配置しておく）
  一応それぞれインターフェース必要なら作ってから。例えばこっちはObserverインターフェース、モデル側にはSubject的な名前のインターフェース？
  でもこれはモデルのメソッドをリファクタしてから。

  これを使えばサービスの中でずらずらと書かなくてよくなるはず。でも循環参照的な無限ループは気をつけないといけない
*/
export class ColumnSpaceRemoved {
  static execute(columnSpaceId: string) {

    console.log("発火！！！！！！！！！！");
  }
}
