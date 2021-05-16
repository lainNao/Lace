
export enum CellDataType {
  // text
  Text = "Text",
  Markdown = "Markdown",
  Table = "Table",
  ChordProgression = "ChordProgression",
  // file
  Image = "Image",
  Sound = "Sound",
  Video = "Video",
}

export const cellDataTypeStrings = {    //TODO 多言語で返すようにしといて。できるのか知らんけど
  get [CellDataType.Text]() {
    return "テキスト";
  },
  get [CellDataType.Markdown]() {
    return "マークダウン";
  },
  get [CellDataType.Table]() {
    return "テーブル";
  },
  get [CellDataType.ChordProgression]() {
    return "コード進行";
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
