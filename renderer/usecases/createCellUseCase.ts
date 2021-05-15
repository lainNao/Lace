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

const makeSpecificUseCase = (cellDataType: CellDataType) => {
  const usecases = {
    [CellDataType.Text]: createTextCellUseCase,
    [CellDataType.Markdown]: createMarkdownCellUseCase,
    [CellDataType.Radio]: createRadioCellUseCase,
    [CellDataType.Boolean]: createBooleanCellUseCase,
    [CellDataType.Sound]: createSoundCellUseCase,
    [CellDataType.Image]: createImageCellUseCase,
    [CellDataType.Video]: createVideoCellUseCase,
  }
  return usecases[cellDataType];
}

export interface CreateCellUsecasesArgs {
  columnDataset: ColumnDataset,
  cellData: any
}

export const createCellUseCase = async(columnDataset: ColumnDataset, cellData: any) => {
  const targetUsecase = makeSpecificUseCase(columnDataset.columnType);
  return await targetUsecase({columnDataset, cellData});
}
