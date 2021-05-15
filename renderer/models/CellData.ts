//TODO 後々抽象クラスにすることあるかも　あとこれでうまくいくのか曖昧な状態だからその認識で
export interface CellData {
  toJSON();

  // NOTE: static fromJSONはなんかtypescriptだと面倒なので書かないけど、これを実装する時は書いて…
}
