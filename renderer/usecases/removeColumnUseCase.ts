import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { RelatedCells } from "../models/RelatedCells";
import { RelatedCellsRepositoryJson } from "../repositories/RelatedCellsRepositoryJson";

export const removeColumnUsecase = async(columnSpaceId: string, columnId: string): Promise<[ColumnSpaces, RelatedCells]> => {
  // カラム削除
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();
  const newRootColumnSpaces = rootColumnSpaces.removeDescendantColumn(columnId)
  await columnSpacesRepository.save(newRootColumnSpaces);

  // 関連リレーション削除
  const relatedCellRepository = new RelatedCellsRepositoryJson();
  const relatedCells = await relatedCellRepository.read();
  const newRelatedCells = relatedCells.removeRelationOfColumn(columnSpaceId, columnId);
  await relatedCellRepository.save(newRelatedCells);

  // TODO 後々一緒に関連する表示設定も消す必要あると思う。ただしこれは大変になるかもな。中間に設定してたカラムが削除されたら、その配下のを上に上げることになるのかな

  return [newRootColumnSpaces, newRelatedCells];
}
