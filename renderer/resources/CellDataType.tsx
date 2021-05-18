import { TextIcon, MarkdownIcon, MusicNoteIcon, VideoIcon, ImageIcon } from "../components/column-type-icons";


export enum CellDataType {
  // text
  Text = "Text",
  Markdown = "Markdown",
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
  get [CellDataType.Image]() {
    return "画像";
  },
  get [CellDataType.Sound]() {
    return "音声";
  },
  get [CellDataType.Video]() {
    return "動画";
  },
}

export const cellDataTypeIcons = (cellDataType: CellDataType, className: string) => {
  switch (cellDataType) {
    case CellDataType.Text: return <TextIcon className={className} />;
    case CellDataType.Markdown: return <MarkdownIcon className={className} />;
    case CellDataType.Image: return <ImageIcon className={className} />;
    case CellDataType.Sound: return <MusicNoteIcon className={className} />;
    case CellDataType.Video: return <VideoIcon className={className} />;
    default: throw new Error("不明なCellDataTypeです");
  }
}
