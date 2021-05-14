import { NewCellFormModalBodyText } from "./NewCellFormModalBodyText";
import { NewCellFormModalBodyRadio } from "./NewCellFormModalBodyRadio";
import { NewCellFormModalBodyMarkdown } from "./NewCellFormModalBodyMarkdown";
import { NewCellFormModalBodyBoolean } from "./NewCellFormModalBodyBoolean";
import { NewCellFormModalBodySound } from "./NewCellFormModalBodySound";
import { NewCellFormModalBodyImage } from "./NewCellFormModalBodyImage";
import { NewCellFormModalBodyVideo } from "./NewCellFormModalBodyVideo";
import { NewCellFormModalBodyNull } from "./NewCellFormModalBodyNull";

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
