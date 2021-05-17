import { assert } from "console";

interface ConstructorArgs {
  data: object,
}

// NOTE: ここは特にモデル化する必要はないと判断したので深い階層まで直接アクセスしてもらう
// TODO ただ、本当にそれでよいのか…別に同じような構造でも階層ごとに名前つける意図でクラス分けてもいいのでは。やること違うしさ　やっぱりよくないので後で階層ごとにモデル作る　でこのルートにいろいろメソッド詰め込む　いや、ルートにあれこれ詰め込めば不要なのでは？いいのかわからんけど
export class RelatedCells {

  private _data: object;

  get data() { return this._data; }

  constructor(args: ConstructorArgs) {
    assert(args != null, "値がありません");

    this._data = args.data;
  }

  static fromJSON(json) {
    return new RelatedCells({
      data: json,
    });
  }

  toJSON() {
    return {
      data: this._data,
    }
  }

}