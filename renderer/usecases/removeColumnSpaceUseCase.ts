import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { RelatedCells } from "../models/RelatedCells";
import { RelatedCellsRepositoryJson } from "../repositories/RelatedCellsRepositoryJson";
import { DisplaySettingsRepositoryJson } from "../repositories/DisplaySettingsRepositoryJson";
import { DisplaySettings } from "../models/DisplaySettings";
import { DbFilesExclusiveTransaction } from "../modules/db";

export const removeColumnSpaceUsecase = async(columnSpaceId: string): Promise<[ColumnSpaces, RelatedCells, DisplaySettings]> => {
  return await DbFilesExclusiveTransaction(
    async () => {
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

      // 表示設定削除
      const displaySettingsRepository = new DisplaySettingsRepositoryJson();
      const displaySettings = await displaySettingsRepository.read();
      const newDisplaySettings = displaySettings.removeDisplaySettingOfSpecificColumnSpaceId(columnSpaceId);
      await displaySettingsRepository.save(newDisplaySettings);

      return [newRootColumnSpaces, newRelatedCells, newDisplaySettings];
    }
  );

}
