import { Cell, ColumnSpaces } from "../models/ColumnSpaces";
import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";

export const updateCellUsecase = async(columnSpaceId: string, columnId: string, cell: Cell): Promise<ColumnSpaces> => {
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();
  const newRootColumnSpaces = rootColumnSpaces.updateDescendantCell(columnSpaceId, columnId, cell);
  return await columnSpacesRepository.save(newRootColumnSpaces);
}