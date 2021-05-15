import { CellData } from "../models/CellData";
import { BooleanCellData } from "../models/CellData.implemented/BooleanCellData";
import { ImageCellData } from "../models/CellData.implemented/ImageCellData";
import { MarkdownCellData } from "../models/CellData.implemented/MarkdownCellData";
import { RadioCellData } from "../models/CellData.implemented/RadioCellData";
import { SoundCellData } from "../models/CellData.implemented/SoundCellData";
import { TextCellData } from "../models/CellData.implemented/TextCellData";
import { VideoCellData } from "../models/CellData.implemented/VideoCellData";
import { CellDataType } from "../resources/CellDataType";

export class CellDataFactory {

  static create(cellDataType: CellDataType, cellData: any): CellData {
    switch (cellDataType) {
      case CellDataType.Text: return new TextCellData(cellData);
      case CellDataType.Boolean: return new BooleanCellData(cellData);
      case CellDataType.Markdown: return new MarkdownCellData(cellData);
      case CellDataType.Radio: return new RadioCellData(cellData);
      case CellDataType.Image: return new ImageCellData(cellData);
      case CellDataType.Sound: return new SoundCellData(cellData);
      case CellDataType.Video: return new VideoCellData(cellData);
      default: throw new Error("不明なCellDataTypeです");
    }
  }
}