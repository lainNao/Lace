import { NewCellFormModalBodyText } from "../pages-partial/home/NewCellFormModalBodyText";
import { NewCellFormModalBodyRadio } from "../pages-partial/home/NewCellFormModalBodyRadio";
import { NewCellFormModalBodyMarkdown } from "../pages-partial/home/NewCellFormModalBodyMarkdown";
import { NewCellFormModalBodyBoolean } from "../pages-partial/home/NewCellFormModalBodyBoolean";
import { NewCellFormModalBodySound } from "../pages-partial/home/NewCellFormModalBodySound";
import { NewCellFormModalBodyImage } from "../pages-partial/home/NewCellFormModalBodyImage";
import { NewCellFormModalBodyVideo } from "../pages-partial/home/NewCellFormModalBodyVideo";
import { NewCellFormModalBodyNull } from "../pages-partial/home/NewCellFormModalBodyNull";

export enum ColumnDataType {    //TODO ここ、最終的にポリモーフィズムで使われれうはずなので、このenumもどうなるかわからない。よりよい書き方あれば変更
  Sound = "Sound",   //これ「Sound」「Image」「Video」とかに分けなくて大丈夫？
  Text = "Text",
  Markdown = "Markdown",
  Radio = "Radio",
  Boolean = "Boolean",
  //TODO 随時追加　ただしenumだから既にあるのの前に追加とかできなくなるので注意
}

export const columnDataTypeStrings = {
  Sound: () => {
    return "サウンドファイル";    //TODO 多言語で返すようにしといて。できるのか知らんけど
  },
  Text: () => {
    return "テキスト";
  },
  Markdown: () => {
    return "マークダウン";
  },
  Radio: () => {
    return "ラジオ";
  },
  Boolean: () => {
    return "真偽値";
  }
}

export const newCellFormModalBodyComponents = {
  // text
  Text: NewCellFormModalBodyText,
  Markdown: NewCellFormModalBodyMarkdown,
  Radio: NewCellFormModalBodyRadio,
  Boolean: NewCellFormModalBodyBoolean,
  // file
  Sound: NewCellFormModalBodySound,
  Image: NewCellFormModalBodyImage,
  Video: NewCellFormModalBodyVideo,
  // フォールバック
  null: NewCellFormModalBodyNull,
  undefined: NewCellFormModalBodyNull,
}
