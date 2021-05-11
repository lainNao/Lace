import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { TrimedFilledString } from "../value-objects/TrimedFilledString";
import { ColumnDataType } from "../enums/app";
import { Column } from "../models/Column";
import { Cells } from "../models/Cells";

export const createColumnUseCase = async(name: TrimedFilledString, toId: string, columnType: ColumnDataType): Promise<ColumnSpaces> => {
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();
  const newRootColumnSpaces = rootColumnSpaces.addDescendantColumn(new Column({
    name: name,
    type: columnType,
    cells: new Cells(),
  }), toId);
  await columnSpacesRepository.save(newRootColumnSpaces);
  return newRootColumnSpaces;
}
