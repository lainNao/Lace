import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces, Column } from "../models/ColumnSpaces";
import { TrimedFilledString } from "../value-objects/TrimedFilledString";

export const renameColumnUsecase = async(targetColumnId: string, newName: string): Promise<ColumnSpaces> => {
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();

  // 対象のカラムを見つける
  const targetColumn = rootColumnSpaces.findDescendantColumn(targetColumnId);

  // なければ例外
  if (!targetColumn) {
    throw new Error("対象のカラムがありません");
  }

  // あれば上書き保存
  const newRootColumnSpaces = rootColumnSpaces.updateDescendantColumn(new Column({
    id: targetColumn.id,
    name: new TrimedFilledString(newName),
    type: targetColumn.type,
    cells: targetColumn.cells,
  }));
  await columnSpacesRepository.save(newRootColumnSpaces);
  return newRootColumnSpaces;
}
