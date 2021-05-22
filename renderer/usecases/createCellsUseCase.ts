import { CellDataType } from "../resources/CellDataType";
import {
  createImageCellsUsecase,
  createMarkdownCellsUsecase,
  createSoundCellsUsecase,
  createTextCellsUsecase,
  createVideoCellsUsecase,
} from "./createCellsUsecase.partial";
import { ColumnSpaces } from "../models/ColumnSpaces";

export interface CreateCellsUsecasesArgs {
  columnSpaceId: string,
  columnId: string,
  columnType: CellDataType,
  cellDatas: any,
}

const makeSpecificUsecase = (cellDataType: CellDataType) => {
  switch (cellDataType) {
    case CellDataType.Text: return createTextCellsUsecase;
    case CellDataType.Markdown: return createMarkdownCellsUsecase;
    case CellDataType.Image: return createImageCellsUsecase;
    case CellDataType.Sound: return createSoundCellsUsecase;
    case CellDataType.Video: return createVideoCellsUsecase;
    default: throw new Error("不明なCellDataTypeです");
  }
}

export const createCellsUsecase = async(columnSpaceId: string, columnId: string, columnType: CellDataType, cellDatas: any): Promise<ColumnSpaces> => {
  const targetUsecase = makeSpecificUsecase(columnType);
  const newColumnSpaces = await targetUsecase({columnSpaceId, columnId, columnType, cellDatas});
  return newColumnSpaces;
}
