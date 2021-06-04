import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { TrimedFilledString } from "../value-objects/TrimedFilledString";
import { CellDataType } from "../resources/CellDataType";
import { Cells, Column, ColumnSpaces } from "../models/ColumnSpaces";
import { DbFilesExclusiveTransaction } from "../modules/db";

export const createColumnUsecase = async(name: TrimedFilledString, toId: string, columnType: CellDataType): Promise<ColumnSpaces> => {
  return await DbFilesExclusiveTransaction(
    async () => {
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
  );
}
