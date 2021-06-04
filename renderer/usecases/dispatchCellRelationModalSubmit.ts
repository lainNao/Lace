import { RelatedCells } from "../models/RelatedCells";
import { DbFilesExclusiveTransaction } from "../modules/db";
import { CellRelationFormData } from "../pages.partial/home/ColumnSpaceExplorer.partial/CellRelationModal";
import { RelatedCellsRepositoryJson } from "../repositories/RelatedCellsRepositoryJson";

export const dispatchCellRelationModalSubmit = async (columnSpaceId: string, cellRelationFormData: CellRelationFormData): Promise<RelatedCells> => {
  return await DbFilesExclusiveTransaction(
    async () => {
      const relatedCellsRepository = new RelatedCellsRepositoryJson();
      const currentRelatedCells = await relatedCellsRepository.read();
      const newRelatedCells = currentRelatedCells.updateRelatedCellsByCellRelationFormData(columnSpaceId, cellRelationFormData);
      return await relatedCellsRepository.save(newRelatedCells);
    }
  );
}