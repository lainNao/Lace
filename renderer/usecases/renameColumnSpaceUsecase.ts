import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces, ColumnSpace } from "../models/ColumnSpaces";
import { TrimedFilledString } from "../value-objects/TrimedFilledString";
import { DbFilesExclusiveTransaction } from "../modules/db";

export const renameColumnSpaceUsecase = async(targetColumnSpaceId: string, newName: string): Promise<ColumnSpaces> => {
  return await DbFilesExclusiveTransaction(
    async () => {
      const columnSpacesRepository = new ColumnSpacesRepositoryJson();
      const rootColumnSpaces = await columnSpacesRepository.read();

      // 対象のカラムを見つける
      const targetColumnSpace = rootColumnSpaces.findDescendantColumnSpace(targetColumnSpaceId);

      // なければ例外
      if (!targetColumnSpace) {
        throw new Error("対象のカラムスペースがありません");
      }

      // あれば上書き保存
      const newRootColumnSpaces = rootColumnSpaces.updateDescendantColumnSpace(new ColumnSpace({
        id: targetColumnSpace.id,
        name: new TrimedFilledString(newName),
        childColumnSpaces: targetColumnSpace.childColumnSpaces,
        columns: targetColumnSpace.columns,
      }));
      await columnSpacesRepository.save(newRootColumnSpaces);
      return newRootColumnSpaces;
    }
  );
}
