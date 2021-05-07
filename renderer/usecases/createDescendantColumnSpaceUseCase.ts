import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpace } from "../models/ColumnSpace";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { Columns } from "../models/Columns";

export const createDescendantColumnSpaceUseCase = async(parentColumnSpaceId: string, newColumnSpaceName: string): Promise<ColumnSpaces> => {
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();
  rootColumnSpaces.addDescendantColumnSpace(new ColumnSpace({
    "name": newColumnSpaceName,
    "childColumnSpaces": new ColumnSpaces(),
    "columns": new Columns(),
  }), parentColumnSpaceId);
  await columnSpacesRepository.save(rootColumnSpaces);
  return rootColumnSpaces;
}