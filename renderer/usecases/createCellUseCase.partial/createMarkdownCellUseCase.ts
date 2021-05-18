import { Cell } from "../../models/ColumnSpaces";
import { MarkdownCellData } from "../../models/ColumnSpaces/CellData.implemented";
import { ColumnSpacesRepositoryJson } from "../../repositories/ColumnSpacesRepositoryJson";
import { CreateCellUsecasesArgs } from "../createCellUseCase";

export const createMarkdownCellUseCase = async(args: CreateCellUsecasesArgs) => {
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();
  const newRootColumnSpaces = rootColumnSpaces.addDescendantCell(
    new Cell({
      data: new MarkdownCellData(args.cellData),
      type: args.columnType,
    }),
    args.columnSpaceId,
    args.columnId,
  );
  await columnSpacesRepository.save(newRootColumnSpaces);
  return newRootColumnSpaces;
}
