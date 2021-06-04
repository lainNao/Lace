import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { Columns, ColumnSpaces, ColumnSpace } from "../models/ColumnSpaces";
import { TrimedFilledString } from "../value-objects/TrimedFilledString";
import { DbFilesExclusiveTransaction } from "../modules/db";

export const createDescendantColumnSpaceUsecase = async(parentColumnSpaceId: string, newColumnSpaceName: TrimedFilledString): Promise<ColumnSpaces> => {
  return await DbFilesExclusiveTransaction(
    async () => {
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
  );
}