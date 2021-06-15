import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { DbFilesExclusiveTransaction } from "../modules/db";

export const updateColumnSpaceOrderUsecase = async(columnSpaceId: string, fromIndex: number, toIndex: number): Promise<ColumnSpaces> => {
  return await DbFilesExclusiveTransaction(
    async () => {
      const columnSpacesRepository = new ColumnSpacesRepositoryJson();
      const columnSpaces = await columnSpacesRepository.read();
      const newColumnSpaces = columnSpaces.updateColumnSpaceOrder(columnSpaceId, fromIndex, toIndex);
      return columnSpacesRepository.save(newColumnSpaces);
    }
  );

}



