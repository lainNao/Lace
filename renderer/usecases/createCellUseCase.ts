import { CellDataType } from "../resources/CellDataType";
import {
  createImageCellUsecase,
  createMarkdownCellUsecase,
  createSoundCellUsecase,
  createTextCellUsecase,
  createVideoCellUsecase,
} from "./createCellUsecase.partial";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { DbFilesExclusiveTransaction } from "../modules/db";

export interface CreateCellUsecasesArgs {
  columnSpaceId: string,
  columnId: string,
  columnType: CellDataType,
  cellData: any,
}

const makeSpecificUsecase = (cellDataType: CellDataType) => {
  switch (cellDataType) {
    case CellDataType.Text: return createTextCellUsecase;
    case CellDataType.Markdown: return createMarkdownCellUsecase;
    case CellDataType.Image: return createImageCellUsecase;
    case CellDataType.Sound: return createSoundCellUsecase;
    case CellDataType.Video: return createVideoCellUsecase;
    default: throw new Error("不明なCellDataTypeです");
  }
}

export const createCellUsecase = async(columnSpaceId: string, columnId: string, columnType: CellDataType, cellData: any): Promise<ColumnSpaces> => {
  const targetUsecase = makeSpecificUsecase(columnType);
  return await DbFilesExclusiveTransaction(
    async () => {
      const newColumnSpaces = await targetUsecase({columnSpaceId, columnId, columnType, cellData});
      return newColumnSpaces;
    }
  );

}
