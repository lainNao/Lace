import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { RelatedCells } from "../models/RelatedCells";
import { RelatedCellsRepositoryJson } from "../repositories/RelatedCellsRepositoryJson";
import { DisplaySettingsRepositoryJson } from "../repositories/DisplaySettingsRepositoryJson";
import { DisplaySettings } from "../models/DisplaySettings";
import { DbFilesExclusiveTransaction } from "../modules/db";
import { isKindOfFileCellDataType } from "../resources/CellDataType";

export const removeColumnUsecase = async(columnSpaceId: string, columnId: string): Promise<[ColumnSpaces, RelatedCells, DisplaySettings]> => {
  return await DbFilesExclusiveTransaction(
    async () => {
      const columnSpacesRepository = new ColumnSpacesRepositoryJson();
      const rootColumnSpaces = await columnSpacesRepository.read();

      // カラム削除の前に、その配下のファイル系セルのファイルをゴミ箱にコピーしておく
      const targetColumnSpace = rootColumnSpaces.findDescendantColumnSpace(columnSpaceId);
      if (!targetColumnSpace)  throw new Error("対象カラムスペースが見つかりませんでした")
      const targetColumn = targetColumnSpace.findDescendantColumn(columnId);
      if (!targetColumn) throw new Error("対象カラムが見つかりませんでした")
      if (isKindOfFileCellDataType(targetColumn.type)) {
        for (const targetCell of targetColumn.cells.children) {
          const filePath = (targetCell.data as any).path;
          const fileBaseName = (targetCell.data as any).basename;
          await columnSpacesRepository.copyCellFileToDustBox(filePath, columnSpaceId, columnId, fileBaseName)
          }
      }

      // カラム削除
      const newRootColumnSpaces = rootColumnSpaces.removeDescendantColumn(columnId)
      await columnSpacesRepository.save(newRootColumnSpaces);

      // 関連リレーション削除
      const relatedCellRepository = new RelatedCellsRepositoryJson();
      const relatedCells = await relatedCellRepository.read();
      const newRelatedCells = relatedCells.removeRelationOfColumn(columnSpaceId, columnId);
      await relatedCellRepository.save(newRelatedCells);

      // 関連表示設定削除
      const displaySettingsRepository = new DisplaySettingsRepositoryJson();
      const displaySettings = await displaySettingsRepository.read();
      const newDisplaySettings = displaySettings.removeSpecificColumnAssociatedItem(columnSpaceId, columnId);
      await displaySettingsRepository.save(newDisplaySettings);

      return [newRootColumnSpaces, newRelatedCells, newDisplaySettings];
    }
  );

}
