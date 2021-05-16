import { CellDataType } from "../resources/CellDataType";
import { CellData } from "../models/CellData";
import {
  TextCellData,
  MarkdownCellData,
  TableCellData,
  ImageCellData,
  SoundCellData,
  VideoCellData,
} from "../models/CellData.implemented"

export class CellDataFactory {

  static create(cellDataType: CellDataType, cellData: any): CellData {
    switch (cellDataType) {
      case CellDataType.Text: return new TextCellData(cellData);
      case CellDataType.Markdown: return new MarkdownCellData(cellData);
      case CellDataType.Table: return new TableCellData(cellData);
      case CellDataType.Image: return new ImageCellData(cellData);
      case CellDataType.Sound: return new SoundCellData(cellData);
      case CellDataType.Video: return new VideoCellData(cellData);
      default: throw new Error("不明なCellDataTypeです");
    }
  }
}