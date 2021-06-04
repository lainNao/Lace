import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpace, ColumnSpaces } from "../models/ColumnSpaces";
import { TrimedFilledString } from "../value-objects/TrimedFilledString";
import { DbFilesExclusiveTransaction } from "../modules/db";

//NOTE: 第三引数が省略されたら、第二引数のカラムを0番目に移動する
//TODO これ第三引数はインデックスのほうが普通なのでは
export const updateColumnOrderUsecase = async(columnSpaceId: string, columnId: string, toColumnId?: string): Promise<ColumnSpaces> => {
  return await DbFilesExclusiveTransaction(
    async () => {
      const columnSpacesRepository = new ColumnSpacesRepositoryJson();
      const rootColumnSpaces = await columnSpacesRepository.read();
      const targetColumnSpace = rootColumnSpaces.findDescendantColumnSpace(columnSpaceId);
      const fromIndex = targetColumnSpace.columns.findIndexOf(columnId);
      const toIndex = (toColumnId) ? targetColumnSpace.columns.findIndexOf(toColumnId) : null;

      ///　順番変わらないならそのまま返す
      if (fromIndex === toIndex) {
        return rootColumnSpaces;
      }

      /// 順番違うなら入れ替えする
      const newColumns = targetColumnSpace.columns.moveColumnFromTo(
        fromIndex,
        (toIndex === null) ? 0 : (toIndex > fromIndex) ? toIndex : toIndex + 1   //NOTE:　移動の目に見える目安がアンダーラインで示されるためそれと感覚が合うように調整
      );
      const newColumnSpaces = await rootColumnSpaces.updateDescendantColumnSpace(new ColumnSpace({
        id: targetColumnSpace.id,
        name: new TrimedFilledString(targetColumnSpace.name),
        columns: newColumns,
        childColumnSpaces: targetColumnSpace.childColumnSpaces,
      }));

      return columnSpacesRepository.save(newColumnSpaces);
    }
  );

}




