
export enum ColumnDataType {    //TODO ここ、最終的にポリモーフィズムで使われれうはずなので、このenumもどうなるかわからない。よりよい書き方あれば変更
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

export const columnDataTypeStrings = {    //TODO 多言語で返すようにしといて。できるのか知らんけど
  get [ColumnDataType.Text]() {
    return "テキスト";
  },
  get [ColumnDataType.Markdown]() {
    return "マークダウン";
  },
  get [ColumnDataType.Boolean]() {
    return "真偽値";
  },
  get [ColumnDataType.Radio]() {
    return "ラジオ";
  },
  get [ColumnDataType.Image]() {
    return "画像";
  },
  get [ColumnDataType.Sound]() {
    return "サウンドファイル";
  },
  get [ColumnDataType.Video]() {
    return "動画";
  },
}
