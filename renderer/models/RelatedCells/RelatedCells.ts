import { assert } from "console";

interface ConstructorArgs {
  data: object,
}

// NOTE: ここは特にモデル化する必要はないと判断したので深い階層まで直接アクセスしてもらう
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