import { RelatedCells } from "../models/RelatedCells";
import { CellRelationFormData } from "../pages.partial/home/ColumnSpaceExplorer.partial/CellRelationModal";
import { RelatedCellsRepositoryJson } from "../repositories/RelatedCellsRepositoryJson";

export const dispatchCellRelationModalSubmit = async (columnSpaceId: string, cellRelationFormData: CellRelationFormData): Promise<RelatedCells> => {
  const relatedCellsRepository = new RelatedCellsRepositoryJson();
  const currentRelatedCells = await relatedCellsRepository.read();
  const newRelatedCells = currentRelatedCells.updateRelatedCellsByCellRelationFormData(columnSpaceId, cellRelationFormData);
  return await relatedCellsRepository.save(newRelatedCells);
}