import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpace } from "../models/ColumnSpace";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { Columns } from "../models/Columns";
import { TrimedFilledString } from "../value-objects/TrimedFilledString";

export const createTopLevelColumnSpaceUseCase = async(newColumnSpaceName: TrimedFilledString): Promise<ColumnSpaces> => {
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();
  console.log(1234, newColumnSpaceName)
  const newRootColumnSpaces = rootColumnSpaces.push(new ColumnSpace({
    "name": newColumnSpaceName,
    "childColumnSpaces": new ColumnSpaces(),
    "columns": new Columns(),
  }));
  await columnSpacesRepository.save(newRootColumnSpaces);
  return newRootColumnSpaces;

}