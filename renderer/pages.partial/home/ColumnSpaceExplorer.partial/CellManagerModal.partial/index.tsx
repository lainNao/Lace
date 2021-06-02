import { CellManagerModalBodyText } from "./Text";
import { CellManagerModalBodyMarkdown } from "./Markdown";
import { CellManagerModalBodySound } from "./Sound";
import { CellManagerModalBodyImage } from "./Image";
import { CellManagerModalBodyVideo } from "./Video";
import { CellManagerModalBodyNull } from "./Null";
import { CellDataType } from "../../../../resources/CellDataType";

export const CellManagerModalBodyComponents = {
  // text
  [CellDataType.Text]: CellManagerModalBodyText,
  [CellDataType.Markdown]: CellManagerModalBodyMarkdown,
  // file
  [CellDataType.Sound]: CellManagerModalBodySound,
  [CellDataType.Image]: CellManagerModalBodyImage,
  [CellDataType.Video]: CellManagerModalBodyVideo,
  // フォールバック
  null: CellManagerModalBodyNull,
  undefined: CellManagerModalBodyNull,
}
