import { NewCellFormModalBodyText } from "./Text";
import { NewCellFormModalBodyRadio } from "./Radio";
import { NewCellFormModalBodyMarkdown } from "./Markdown";
import { NewCellFormModalBodyBoolean } from "./Boolean";
import { NewCellFormModalBodySound } from "./Sound";
import { NewCellFormModalBodyImage } from "./Image";
import { NewCellFormModalBodyVideo } from "./Video";
import { NewCellFormModalBodyNull } from "./Null";
import { CellDataType } from "../../../resources/CellDataType";

export const newCellFormModalBodyComponents = {
  // text
  [CellDataType.Text]: NewCellFormModalBodyText,
  [CellDataType.Markdown]: NewCellFormModalBodyMarkdown,
  [CellDataType.Radio]: NewCellFormModalBodyRadio,
  [CellDataType.Boolean]: NewCellFormModalBodyBoolean,
  // file
  [CellDataType.Sound]: NewCellFormModalBodySound,
  [CellDataType.Image]: NewCellFormModalBodyImage,
  [CellDataType.Video]: NewCellFormModalBodyVideo,
  // フォールバック
  null: NewCellFormModalBodyNull,
  undefined: NewCellFormModalBodyNull,
}
