import { ColumnSpaces } from "../models/ColumnSpaces";
import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { DbFilesExclusiveTransaction } from "../modules/db";
import { GlobalSettingsRepositoryJson } from "../repositories/GlobalSettingsRepositoryJson";
import { GlobalSettings } from "../models/GlobalSettings";
import fs from 'fs-extra';

export const updateDbPathUsecase = async(key: string, oldUserDirectory: string, newUserDirectory: string): Promise<[ColumnSpaces, GlobalSettings]> => {
  return await DbFilesExclusiveTransaction(
    async () => {

      // フォルダをコピー
      await fs.copy(oldUserDirectory, newUserDirectory)

      // 保存先設定変更
      const globalSettingsRepository = new GlobalSettingsRepositoryJson();
      const globalSettings = await globalSettingsRepository.read();
      const newGlobalSettings = globalSettings.updateGlobalSetting(key, newUserDirectory);
      const newGlobalSettingsResult = await globalSettingsRepository.save(newGlobalSettings);

      // ファイルパスも新しく置き換える
      const columnSpacesRepository = new ColumnSpacesRepositoryJson();
      const rootColumnSpaces = await columnSpacesRepository.read();
      const newRootColumnSpaces = rootColumnSpaces.updateFileDirectory(oldUserDirectory, newUserDirectory);
      const newColumnSpaces = await columnSpacesRepository.save(newRootColumnSpaces);

      return [newColumnSpaces, newGlobalSettingsResult];

    }
  );
}
