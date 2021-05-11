import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpace } from "../models/ColumnSpace";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { Columns } from "../models/Columns";
import { TrimedFilledString } from "../value-objects/TrimedFilledString";

export const createDescendantColumnSpaceUseCase = async(parentColumnSpaceId: string, newColumnSpaceName: TrimedFilledString): Promise<ColumnSpaces> => {
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();
  const newRootColumnSpaces = rootColumnSpaces.addDescendantColumnSpace(new ColumnSpace({
    "name": newColumnSpaceName,
    "childColumnSpaces": new ColumnSpaces(),
    "columns": new Columns(),
  }), parentColumnSpaceId);
  await columnSpacesRepository.save(newRootColumnSpaces);
  return newRootColumnSpaces;
}