import { Cell, Cells, ColumnSpaces } from "../../models/ColumnSpaces";
import { MarkdownCellData } from "../../models/ColumnSpaces/CellData.implemented";
import { ColumnSpacesRepositoryJson } from "../../repositories/ColumnSpacesRepositoryJson";
import { CreateCellsUsecasesArgs } from "../createCellsUseCase";

export const createMarkdownCellsUseCase = async(args: CreateCellsUsecasesArgs): Promise<ColumnSpaces> => {
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();

  const newRootColumnSpaces = rootColumnSpaces.addDescendantCells(
    new Cells({
      children: args.cellDatas.map(cellData => new Cell({
        data: new MarkdownCellData(cellData),
        type: args.columnType,
      })),
    }),
    args.columnSpaceId,
    args.columnId,
  );

  return await columnSpacesRepository.save(newRootColumnSpaces);
}