import { ColumnDataset } from "../resources/types";
import { CellDataType } from "../resources/CellDataType";
import {
  createBooleanCellUseCase,
  createImageCellUseCase,
  createMarkdownCellUseCase,
  createRadioCellUseCase,
  createSoundCellUseCase,
  createTextCellUseCase,
  createVideoCellUseCase,
} from "./createCellUseCase.partial";

export interface CreateCellUsecasesArgs {
  columnDataset: ColumnDataset,
  cellData: any
}

const makeSpecificUseCase = (cellDataType: CellDataType) => {
  switch (cellDataType) {
    case CellDataType.Text: return createTextCellUseCase;
    case CellDataType.Markdown: return createMarkdownCellUseCase;
    case CellDataType.Boolean: return createBooleanCellUseCase;
    case CellDataType.Radio: return createRadioCellUseCase;
    case CellDataType.Image: return createSoundCellUseCase;
    case CellDataType.Sound: return createSoundCellUseCase;
    case CellDataType.Video: return createVideoCellUseCase;
    default: throw new Error("不明なCellDataTypeです");
  }
}

export const createCellUseCase = async(columnDataset: ColumnDataset, cellData: any) => {
  const targetUsecase = makeSpecificUseCase(columnDataset.columnType);
  return await targetUsecase({columnDataset, cellData});
}
