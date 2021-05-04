import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpace } from "../models/ColumnSpace";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { Columns } from "../models/Columns";

export const createNewColumnSpace = (newColumnSpaceName: string): ColumnSpaces => {

  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = columnSpacesRepository.readDB();
  rootColumnSpaces.addColumnSpace(new ColumnSpace({
    "name": newColumnSpaceName,
    "childColumnSpaces": new ColumnSpaces(),
    "columns": new Columns(),
  }));
  columnSpacesRepository.save(rootColumnSpaces);

  return rootColumnSpaces;
}