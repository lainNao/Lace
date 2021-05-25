import { Cell, Cells, ColumnSpaces } from "../../models/ColumnSpaces";
import { TextCellData } from "../../models/ColumnSpaces/CellData.implemented";
import { ColumnSpacesRepositoryJson } from "../../repositories/ColumnSpacesRepositoryJson";
import { CreateCellsUsecasesArgs } from "../createCellsUsecase";

export const createTextCellsUsecase = async(args: CreateCellsUsecasesArgs): Promise<ColumnSpaces> => {
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();

  const newRootColumnSpaces = rootColumnSpaces.addDescendantCells(
    new Cells({
      children: [
        new Cell({
          data: new TextCellData(args.cellDatas),
          type: args.columnType,
        })
      ]
    }),
    args.columnSpaceId,
    args.columnId,
  );

  return await columnSpacesRepository.save(newRootColumnSpaces);
}