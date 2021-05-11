import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";

export const moveColumnSpaceToTopLevelUseCase = async(id: string,): Promise<ColumnSpaces> => {
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();
  const newRootColumnSpaces = rootColumnSpaces.moveColumnSpaceToTopLevel(id)
  await columnSpacesRepository.save(newRootColumnSpaces);
  return newRootColumnSpaces;
}
