import { CellRelationFormData } from "../pages.partial/home/CellRelationModal";
import { RelatedCellsRepositoryJson } from "../repositories/RelatedCellsRepositoryJson";

export const dispatchCellRelationModalSubmit = async (columnSpaceId: string, cellRelationFormData: CellRelationFormData) => {
  const relatedCellsRepository = new RelatedCellsRepositoryJson();
  const currentRelatedCells = await relatedCellsRepository.read();
  const newRelatedCells = currentRelatedCells.updateRelatedCellsByCellRelationFormData(columnSpaceId, cellRelationFormData);
  return await relatedCellsRepository.save(newRelatedCells);
}