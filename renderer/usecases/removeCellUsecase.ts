import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { RelatedCells } from "../models/RelatedCells";
import { RelatedCellsRepositoryJson } from "../repositories/RelatedCellsRepositoryJson";
import { DbFilesExclusiveTransaction } from "../modules/db";
import { isKindOfFileCellDataType } from "../resources/CellDataType";

export const removeCellUsecase = async(columnSpaceId: string, columnId: string, cellId: string): Promise<[ColumnSpaces, RelatedCells]> => {
  return await DbFilesExclusiveTransaction(
    async () => {
      const columnSpacesRepository = new ColumnSpacesRepositoryJson();
      const rootColumnSpaces = await columnSpacesRepository.read();

      // セル削除の前に、ファイル系セルのファイルをゴミ箱にコピーしておく
      const targetCell = rootColumnSpaces.findDescendantCell(columnSpaceId, columnId, cellId);
      if (isKindOfFileCellDataType(targetCell.type)) {
        // TODO 無理やりanyにしちゃってるからここ、ファイル類用のインターフェース等がほしい。そこに↑のisKindOf～のようなものを実装すればいいのかなという雰囲気も若干あるし
        const filePath = (targetCell.data as any).path;
        const fileBaseName = (targetCell.data as any).basename;
        await columnSpacesRepository.copyCellFileToDustBox(filePath, columnSpaceId, columnId, fileBaseName)
      }

      // セル削除
      const newRootColumnSpaces = rootColumnSpaces.removeDescendantCell(columnSpaceId, columnId, cellId)
      await columnSpacesRepository.save(newRootColumnSpaces);

      // 関連リレーション削除
      const relatedCellRepository = new RelatedCellsRepositoryJson();
      const relatedCells = await relatedCellRepository.read();
      const newRelatedCells = relatedCells.removeRelationOfCell(columnSpaceId, columnId, cellId);
      await relatedCellRepository.save(newRelatedCells);

      return [newRootColumnSpaces, newRelatedCells];
    }
  );
}
