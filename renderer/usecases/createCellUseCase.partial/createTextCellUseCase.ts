import { Cell, ColumnSpaces } from "../../models/ColumnSpaces";
import { TextCellData } from "../../models/ColumnSpaces/CellData.implemented";
import { ColumnSpacesRepositoryJson } from "../../repositories/ColumnSpacesRepositoryJson";
import { CreateCellUsecasesArgs } from "../createCellUsecase";

export const createTextCellUsecase = async(args: CreateCellUsecasesArgs): Promise<ColumnSpaces> => {
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();
  const newRootColumnSpaces = rootColumnSpaces.addDescendantCell(
    new Cell({
      data: new TextCellData(args.cellData),
      type: args.columnType,
    }),
    args.columnSpaceId,
    args.columnId,
  );
  await columnSpacesRepository.save(newRootColumnSpaces);
  return newRootColumnSpaces;
}
