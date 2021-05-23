import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { RelatedCells } from "../models/RelatedCells";
import { RelatedCellsRepositoryJson } from "../repositories/RelatedCellsRepositoryJson";

export const removeColumnSpaceUsecase = async(columnSpaceId: string): Promise<[ColumnSpaces, RelatedCells]> => {
  //TODO トランザクション的なことしたいところ

  // カラムスペース削除
  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();
  const newRootColumnSpaces = rootColumnSpaces.removeDescendantColumnSpace(columnSpaceId)
  await columnSpacesRepository.save(newRootColumnSpaces);

  // リレーション削除
  const relatedCellRepository = new RelatedCellsRepositoryJson();
  const relatedCells = await relatedCellRepository.read();
  const newRelatedCells = relatedCells.removeRelationOfColumnSpace(columnSpaceId);
  await relatedCellRepository.save(newRelatedCells);

  return [newRootColumnSpaces, newRelatedCells];
}
