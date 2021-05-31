import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { RelatedCells } from "../models/RelatedCells";
import { RelatedCellsRepositoryJson } from "../repositories/RelatedCellsRepositoryJson";
import { DisplaySettingsRepositoryJson } from "../repositories/DisplaySettingsRepositoryJson";
import { DisplaySettings } from "../models/DisplaySettings";

export const removeColumnUsecase = async(columnSpaceId: string, columnId: string): Promise<[ColumnSpaces, RelatedCells, DisplaySettings]> => {
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

  // 関連表示設定削除
  const displaySettingsRepository = new DisplaySettingsRepositoryJson();
  const displaySettings = await displaySettingsRepository.read();
  const newDisplaySettings = displaySettings.removeSpecificColumnAssociatedItem(columnSpaceId, columnId);
  await displaySettingsRepository.save(newDisplaySettings);

  return [newRootColumnSpaces, newRelatedCells, newDisplaySettings];
}
