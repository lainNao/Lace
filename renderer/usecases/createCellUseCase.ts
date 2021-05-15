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

const makeSubUseCase = (cellDataType: CellDataType) => {
  const handlers = {
    [CellDataType.Text]: createTextCellUseCase,
    [CellDataType.Markdown]: createMarkdownCellUseCase,
    [CellDataType.Radio]: createRadioCellUseCase,
    [CellDataType.Boolean]: createBooleanCellUseCase,
    [CellDataType.Sound]: createSoundCellUseCase,
    [CellDataType.Image]: createImageCellUseCase,
    [CellDataType.Video]: createVideoCellUseCase,
  }
  return handlers[cellDataType];
}

export interface CreateCellUsecasesArgs {
  columnDataset: ColumnDataset,
  cellData: any
}

export const createCellUseCase = async(columnDataset: ColumnDataset, cellData: any) => {
  const subUsecase = makeSubUseCase(columnDataset.columnType);
  return await subUsecase({columnDataset, cellData});
}
