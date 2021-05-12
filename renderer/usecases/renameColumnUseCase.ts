import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { Column } from "../models/Column";
import { TrimedFilledString } from "../value-objects/TrimedFilledString";

//TODO 適当に作っといたけど動作確認一切してないので、カラムのリネームのUI作ったら確かめて
export const renameColumnUseCase = async(targetColumnId: string, newName: string): Promise<ColumnSpaces> => {
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



