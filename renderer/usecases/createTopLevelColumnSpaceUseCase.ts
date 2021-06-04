import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces, ColumnSpace, Columns } from "../models/ColumnSpaces";
import { TrimedFilledString } from "../value-objects/TrimedFilledString";
import { DbFilesExclusiveTransaction } from "../modules/db";

export const createTopLevelColumnSpaceUsecase = async(newColumnSpaceName: TrimedFilledString): Promise<ColumnSpaces> => {
  return await DbFilesExclusiveTransaction(
    async () => {
      const columnSpacesRepository = new ColumnSpacesRepositoryJson();
      const rootColumnSpaces = await columnSpacesRepository.read();
      const newRootColumnSpaces = rootColumnSpaces.push(new ColumnSpace({
        "name": newColumnSpaceName,
        "childColumnSpaces": new ColumnSpaces(),
        "columns": new Columns(),
      }));
      await columnSpacesRepository.save(newRootColumnSpaces);
      return newRootColumnSpaces;
    }
  );

}