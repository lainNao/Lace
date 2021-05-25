import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { RelatedCells } from "../models/RelatedCells";
import { RelatedCellsRepositoryJson } from "../repositories/RelatedCellsRepositoryJson";

// TODO ちゃんと動作確認したいところ
export const removeCellUsecase = async(columnSpaceId: string, columnId: string, cellId: string): Promise<[ColumnSpaces, RelatedCells]> => {
  // カラム削除
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();
  const newRootColumnSpaces = rootColumnSpaces.removeDescendantCell(columnSpaceId, columnId, cellId)
  await columnSpacesRepository.save(newRootColumnSpaces);

  // 関連リレーション削除
  const relatedCellRepository = new RelatedCellsRepositoryJson();
  const relatedCells = await relatedCellRepository.read();
  const newRelatedCells = relatedCells.removeRelationOfCell(columnSpaceId, columnId, cellId);
  await relatedCellRepository.save(newRelatedCells);

  return [newRootColumnSpaces, newRelatedCells];
}
