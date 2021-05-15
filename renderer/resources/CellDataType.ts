
export enum CellDataType {    //TODO ここ、最終的にポリモーフィズムで使われれうはずなので、このenumもどうなるかわからない。よりよい書き方あれば変更
  // text
  Text = "Text",
  Markdown = "Markdown",
  Boolean = "Boolean",
  Radio = "Radio",
  // file
  Image = "Image",
  Sound = "Sound",
  Video = "Video",

  //TODO 随時追加
}

export const cellDataTypeStrings = {    //TODO 多言語で返すようにしといて。できるのか知らんけど
  get [CellDataType.Text]() {
    return "テキスト";
  },
  get [CellDataType.Markdown]() {
    return "マークダウン";
  },
  get [CellDataType.Boolean]() {
    return "真偽値";
  },
  get [CellDataType.Radio]() {
    return "ラジオ";
  },
  get [CellDataType.Image]() {
    return "画像";
  },
  get [CellDataType.Sound]() {
    return "サウンドファイル";
  },
  get [CellDataType.Video]() {
    return "動画";
  },
}
