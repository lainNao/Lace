import { ColumnDataset } from "../resources/types";
import { CellDataType } from "../resources/CellDataType";
import { createBooleanCellUseCase } from "./createCellUseCase.partial/createBooleanCellUseCase";
import { createImageCellUseCase } from "./createCellUseCase.partial/createImageCellUseCase";
import { createMarkdownCellUseCase } from "./createCellUseCase.partial/createMarkdownCellUseCase";
import { createRadioCellUseCase } from "./createCellUseCase.partial/createRadioCellUseCase";
import { createSoundCellUseCase } from "./createCellUseCase.partial/createSoundCellUseCase";
import { createTextCellUseCase } from "./createCellUseCase.partial/createTextCellUseCase";
import { createVideoCellUseCase } from "./createCellUseCase.partial/createVideoCellUseCase";

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
