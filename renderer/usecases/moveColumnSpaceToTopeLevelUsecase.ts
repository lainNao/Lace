import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { DbFilesExclusiveTransaction } from "../modules/db";

export const moveColumnSpaceToTopLevelUsecase = async(id: string,): Promise<ColumnSpaces> => {
  return await DbFilesExclusiveTransaction(
    async () => {
      const columnSpacesRepository = new ColumnSpacesRepositoryJson();
      const rootColumnSpaces = await columnSpacesRepository.read();
      const newRootColumnSpaces = rootColumnSpaces.moveColumnSpaceToTopLevel(id)
      await columnSpacesRepository.save(newRootColumnSpaces);
      return newRootColumnSpaces;
    }
  );
}
