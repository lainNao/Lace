import { ColumnDataset } from "../resources/types";
import { CellDataType } from "../resources/CellDataType";
import {
  createTableCellUseCase,
  createImageCellUseCase,
  createMarkdownCellUseCase,
  createSoundCellUseCase,
  createTextCellUseCase,
  createVideoCellUseCase,
  createChordProgressionCellUseCase,
} from "./createCellUseCase.partial";

export interface CreateCellUsecasesArgs {
  columnDataset: ColumnDataset,
  cellData: any
}

const makeSpecificUseCase = (cellDataType: CellDataType) => {
  switch (cellDataType) {
    case CellDataType.Text: return createTextCellUseCase;
    case CellDataType.Markdown: return createMarkdownCellUseCase;
    case CellDataType.Table: return createTableCellUseCase;
    case CellDataType.Image: return createImageCellUseCase;
    case CellDataType.Sound: return createSoundCellUseCase;
    case CellDataType.Video: return createVideoCellUseCase;
    case CellDataType.ChordProgression: return createChordProgressionCellUseCase;
    default: throw new Error("不明なCellDataTypeです");
  }
}

export const createCellUseCase = async(columnDataset: ColumnDataset, cellData: any) => {
  const targetUsecase = makeSpecificUseCase(columnDataset.columnType);
  return await targetUsecase({columnDataset, cellData});
}
