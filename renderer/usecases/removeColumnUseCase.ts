import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";

export const removeColumnUsecase = async(id: string): Promise<ColumnSpaces> => {
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();
  const newRootColumnSpaces = rootColumnSpaces.removeDescendantColumn(id)
  await columnSpacesRepository.save(newRootColumnSpaces);
  return newRootColumnSpaces;
}
