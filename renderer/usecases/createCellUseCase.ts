import { CellDataType } from "../resources/CellDataType";
import {
  createImageCellUseCase,
  createMarkdownCellUseCase,
  createSoundCellUseCase,
  createTextCellUseCase,
  createVideoCellUseCase,
} from "./createCellUseCase.partial";
import { RelatedCells } from "../models/RelatedCells";
import { RelatedCellsRepositoryJson } from "../repositories/RelatedCellsRepositoryJson";

export interface CreateCellUsecasesArgs {
  columnSpaceId: string,
  columnId: string,
  columnType: CellDataType,
  cellData: any,
}

const makeSpecificUseCase = (cellDataType: CellDataType) => {
  switch (cellDataType) {
    case CellDataType.Text: return createTextCellUseCase;
    case CellDataType.Markdown: return createMarkdownCellUseCase;
    case CellDataType.Image: return createImageCellUseCase;
    case CellDataType.Sound: return createSoundCellUseCase;
    case CellDataType.Video: return createVideoCellUseCase;
    default: throw new Error("不明なCellDataTypeです");
  }
}

export const createCellUseCase = async(columnSpaceId: string, columnId: string, columnType: CellDataType, cellData: any, relatedCells?: RelatedCells) => {
  const targetUsecase = makeSpecificUseCase(columnType);

  //TODO トランザクションしたい

  const newColumnSpaces = await targetUsecase({columnSpaceId, columnId, columnType, cellData});
  const newRelatedCells = (relatedCells)
    ? (new RelatedCellsRepositoryJson).save(relatedCells)
    : (new RelatedCellsRepositoryJson).read();

  return [newColumnSpaces, newRelatedCells];
}
