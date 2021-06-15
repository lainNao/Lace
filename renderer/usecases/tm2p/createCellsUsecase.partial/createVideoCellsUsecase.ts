import { Cell, Cells, ColumnSpaces } from "../../../models/ColumnSpaces";
import { VideoCellData } from "../../../models/ColumnSpaces/CellData.implemented";
import { ColumnSpacesRepositoryJson } from "../../../repositories/ColumnSpacesRepositoryJson";
import { CreateCellsUsecasesArgs } from "../../createCellsUsecase";

export const createVideoCellsUsecase = async(args: CreateCellsUsecasesArgs): Promise<ColumnSpaces> => {
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();

  //TODO エラーハンドリング　できればトランザクションしたいところ…
  //TODO なんかここ変なので後でなおしたいところ
  const savedFilePaths = await columnSpacesRepository.saveColumnFiles(
    args.columnSpaceId,
    args.columnId,
    args.cellDatas,
  );
  const newRootColumnSpaces = rootColumnSpaces.addDescendantCells(
    new Cells({
      children: savedFilePaths.map(cellData => new Cell({
        data: new VideoCellData({path: cellData}),
        type: args.columnType,
      })),
    }),
    args.columnSpaceId,
    args.columnId,
  );
  return await columnSpacesRepository.save(newRootColumnSpaces);
}