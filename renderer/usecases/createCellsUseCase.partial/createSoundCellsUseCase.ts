import { Cell, Cells, ColumnSpaces } from "../../models/ColumnSpaces";
import { SoundCellData } from "../../models/ColumnSpaces/CellData.implemented";
import { ColumnSpacesRepositoryJson } from "../../repositories/ColumnSpacesRepositoryJson";
import { CreateCellsUsecasesArgs } from "../createCellsUseCase";

export const createSoundCellsUseCase = async(args: CreateCellsUsecasesArgs): Promise<ColumnSpaces> => {
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();

  //TODO エラーハンドリング　できればトランザクションしたいところ…
  const savedFilePaths = await columnSpacesRepository.saveColumnFiles(
    args.columnId,
    args.cellDatas,
  );

  const newRootColumnSpaces = rootColumnSpaces.addDescendantCells(
    new Cells({
      children: savedFilePaths.map(cellData => new Cell({
        data: new SoundCellData({path: cellData}),
        type: args.columnType,
      })),
    }),
    args.columnSpaceId,
    args.columnId,
  );

  return await columnSpacesRepository.save(newRootColumnSpaces);
}