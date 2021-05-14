import { NewCellFormModalBodyText } from "./Text";
import { NewCellFormModalBodyRadio } from "./Radio";
import { NewCellFormModalBodyMarkdown } from "./Markdown";
import { NewCellFormModalBodyBoolean } from "./Boolean";
import { NewCellFormModalBodySound } from "./Sound";
import { NewCellFormModalBodyImage } from "./Image";
import { NewCellFormModalBodyVideo } from "./Video";
import { NewCellFormModalBodyNull } from "./Null";
import { ColumnDataType } from "../../../resources/ColumnDataType";

export const newCellFormModalBodyComponents = {
  // text
  [ColumnDataType.Text]: NewCellFormModalBodyText,
  [ColumnDataType.Markdown]: NewCellFormModalBodyMarkdown,
  [ColumnDataType.Radio]: NewCellFormModalBodyRadio,
  [ColumnDataType.Boolean]: NewCellFormModalBodyBoolean,
  // file
  [ColumnDataType.Sound]: NewCellFormModalBodySound,
  [ColumnDataType.Image]: NewCellFormModalBodyImage,
  [ColumnDataType.Video]: NewCellFormModalBodyVideo,
  // フォールバック
  null: NewCellFormModalBodyNull,
  undefined: NewCellFormModalBodyNull,
}
