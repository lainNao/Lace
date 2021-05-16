import { NewCellFormModalBodyText } from "./Text";
import { NewCellFormModalBodyChordProgression } from "./ChordProgression";
import { NewCellFormModalBodyMarkdown } from "./Markdown";
import { NewCellFormModalBodyTable } from "./Table";
import { NewCellFormModalBodySound } from "./Sound";
import { NewCellFormModalBodyImage } from "./Image";
import { NewCellFormModalBodyVideo } from "./Video";
import { NewCellFormModalBodyNull } from "./Null";
import { CellDataType } from "../../../resources/CellDataType";

export const newCellFormModalBodyComponents = {
  // text
  [CellDataType.Text]: NewCellFormModalBodyText,
  [CellDataType.Markdown]: NewCellFormModalBodyMarkdown,
  [CellDataType.ChordProgression]: NewCellFormModalBodyChordProgression,
  [CellDataType.Table]: NewCellFormModalBodyTable,
  // file
  [CellDataType.Sound]: NewCellFormModalBodySound,
  [CellDataType.Image]: NewCellFormModalBodyImage,
  [CellDataType.Video]: NewCellFormModalBodyVideo,
  // フォールバック
  null: NewCellFormModalBodyNull,
  undefined: NewCellFormModalBodyNull,
}
