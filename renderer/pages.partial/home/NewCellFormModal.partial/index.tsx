import { NewCellFormModalBodyText } from "./NewCellFormModalBodyText";
import { NewCellFormModalBodyRadio } from "./NewCellFormModalBodyRadio";
import { NewCellFormModalBodyMarkdown } from "./NewCellFormModalBodyMarkdown";
import { NewCellFormModalBodyBoolean } from "./NewCellFormModalBodyBoolean";
import { NewCellFormModalBodySound } from "./NewCellFormModalBodySound";
import { NewCellFormModalBodyImage } from "./NewCellFormModalBodyImage";
import { NewCellFormModalBodyVideo } from "./NewCellFormModalBodyVideo";
import { NewCellFormModalBodyNull } from "./NewCellFormModalBodyNull";
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
