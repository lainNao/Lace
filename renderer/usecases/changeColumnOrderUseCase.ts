import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";

//NOTE: 第三引数が省略されたら、第二引数のカラムを0番目に移動する
export const changeColumnOrderUseCase = async(columnSpaceId: string, columnId: string, toColumnId?: string): Promise<ColumnSpaces> => {

  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();
  const targetColumnSpace = rootColumnSpaces.findDescendantColumnSpace(columnSpaceId);
  const fromIndex = targetColumnSpace.columns.findIndexOf(columnId);
  const toIndex = (toColumnId) ? targetColumnSpace.columns.findIndexOf(toColumnId) : null;

  if (fromIndex === toIndex) {
    return rootColumnSpaces;
  }

  targetColumnSpace.columns = targetColumnSpace.columns.moveColumnFromTo(
    fromIndex,
    (toIndex === null) ? 0 : (toIndex > fromIndex) ? toIndex : toIndex + 1   //NOTE:　移動の目に見える目安がアンダーラインで示されるためそれと感覚が合うように調整
  );
  return await columnSpacesRepository.updateDescendantColumnSpace(targetColumnSpace);

}




