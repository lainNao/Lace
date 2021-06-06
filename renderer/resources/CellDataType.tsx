import React from "react";
import { TextIcon, MarkdownIcon, SoundIcon, VideoIcon, ImageIcon } from "../components/column-type-icons";
import { Cell } from "../models/ColumnSpaces";
import { CellData } from "../models/ColumnSpaces/CellData";
import { ImageCellData, MarkdownCellData, SoundCellData, TextCellData, VideoCellData } from "../models/ColumnSpaces/CellData.implemented";

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
    case CellDataType.Sound: return <SoundIcon className={className} />;
    case CellDataType.Video: return <VideoIcon className={className} />;
    default: throw new Error("不明なCellDataTypeです");
  }
}

export const cellDataTypeSelectOptionText = (cellDataType: CellDataType, cellData: CellData) => {
  switch (cellDataType) {
    case CellDataType.Text: return (cellData as TextCellData).text;
    case CellDataType.Markdown: return (cellData as MarkdownCellData).title;
    case CellDataType.Image: return (cellData as ImageCellData).name;
    case CellDataType.Sound: return (cellData as SoundCellData).name;
    case CellDataType.Video: return (cellData as VideoCellData).name;
    default: throw new Error("不明なCellDataTypeです");
  }
}

type CellPreviewProps = {
  cell: Cell,
  className: string,
}
