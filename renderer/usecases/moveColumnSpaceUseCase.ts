import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { DbFilesExclusiveTransaction } from "../modules/db";

export const moveColumnSpaceUsecase = async(id: string, toId: string): Promise<ColumnSpaces> => {
  return await DbFilesExclusiveTransaction(
    async () => {
      const columnSpacesRepository = new ColumnSpacesRepositoryJson();
      const rootColumnSpaces = await columnSpacesRepository.read();
      const newRootColumnSpaces = rootColumnSpaces.moveDescendantColumnSpace(id, toId)
      await columnSpacesRepository.save(newRootColumnSpaces);
      return newRootColumnSpaces;
    }
  );
}
