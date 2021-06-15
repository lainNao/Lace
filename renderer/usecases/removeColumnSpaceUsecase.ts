import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { RelatedCells } from "../models/RelatedCells";
import { RelatedCellsRepositoryJson } from "../repositories/RelatedCellsRepositoryJson";
import { DisplaySettingsRepositoryJson } from "../repositories/DisplaySettingsRepositoryJson";
import { DisplaySettings } from "../models/DisplaySettings";
import { DbFilesExclusiveTransaction } from "../modules/db";
import { isKindOfFileCellDataType } from "../resources/CellDataType";

export const removeColumnSpaceUsecase = async(columnSpaceId: string): Promise<[ColumnSpaces, RelatedCells, DisplaySettings]> => {
  return await DbFilesExclusiveTransaction(
    async () => {
      const columnSpacesRepository = new ColumnSpacesRepositoryJson();
      const rootColumnSpaces = await columnSpacesRepository.read();

      // カラムスペース削除の前に、その配下のファイル系セルのファイルをゴミ箱にコピーしておく
      const targetAncestorColumnSpace = rootColumnSpaces.findDescendantColumnSpace(columnSpaceId);
      const targetColumnSpaces = targetAncestorColumnSpace.findDescendantColumnSpacesHasColumn();
      for (const targetColumnSpace of targetColumnSpaces) {
        for (const targetColumn of targetColumnSpace.columns.children) {
          if (!isKindOfFileCellDataType(targetColumn.type)) {
            continue;
          }
          for (const targetCell of targetColumn.cells.children) {
            const filePath = (targetCell.data as any).path;
            const fileBaseName = (targetCell.data as any).basename;
            await columnSpacesRepository.copyCellFileToDustBox(filePath, targetColumnSpace.id, targetColumn.id, fileBaseName)
          }
        }
      }
      // カラムスペース削除
      const newRootColumnSpaces = rootColumnSpaces.removeDescendantColumnSpace(columnSpaceId)
      await columnSpacesRepository.save(newRootColumnSpaces);

      // リレーション削除
      const relatedCellRepository = new RelatedCellsRepositoryJson();
      const relatedCells = await relatedCellRepository.read();
      const newRelatedCells = relatedCells.removeRelationOfColumnSpace(columnSpaceId);
      await relatedCellRepository.save(newRelatedCells);

      // 表示設定削除
      const displaySettingsRepository = new DisplaySettingsRepositoryJson();
      const displaySettings = await displaySettingsRepository.read();
      const newDisplaySettings = displaySettings.removeDisplaySettingOfSpecificColumnSpaceId(columnSpaceId);
      await displaySettingsRepository.save(newDisplaySettings);

      return [newRootColumnSpaces, newRelatedCells, newDisplaySettings];
    }
  );

}
