import { CellDataType } from "../resources/CellDataType";
import {
  createImageCellsUseCase,
  createMarkdownCellsUseCase,
  createSoundCellsUseCase,
  createTextCellsUseCase,
  createVideoCellsUseCase,
} from "./createCellsUseCase.partial";
import { ColumnSpaces } from "../models/ColumnSpaces";

export interface CreateCellsUsecasesArgs {
  columnSpaceId: string,
  columnId: string,
  columnType: CellDataType,
  cellDatas: any,
}

const makeSpecificUseCase = (cellDataType: CellDataType) => {
  switch (cellDataType) {
    case CellDataType.Text: return createTextCellsUseCase;
    case CellDataType.Markdown: return createMarkdownCellsUseCase;
    case CellDataType.Image: return createImageCellsUseCase;
    case CellDataType.Sound: return createSoundCellsUseCase;
    case CellDataType.Video: return createVideoCellsUseCase;
    default: throw new Error("不明なCellDataTypeです");
  }
}

export const createCellsUseCase = async(columnSpaceId: string, columnId: string, columnType: CellDataType, cellDatas: any): Promise<ColumnSpaces> => {
  const targetUsecase = makeSpecificUseCase(columnType);
  const newColumnSpaces = await targetUsecase({columnSpaceId, columnId, columnType, cellDatas});
  return newColumnSpaces;
}
