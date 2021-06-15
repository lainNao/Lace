import { GlobalSettings } from "../models/GlobalSettings";
import { DbFilesExclusiveTransaction } from "../modules/db";
import { GlobalSettingsRepositoryJson } from "../repositories/GlobalSettingsRepositoryJson";

export const updateGlobalSettingUsecase = async(key: string, value: any): Promise<GlobalSettings> => {
  return await DbFilesExclusiveTransaction(
    async () => {
      const globalSettingsRepository = new GlobalSettingsRepositoryJson();
      const globalSettings = await globalSettingsRepository.read();
      const newGlobalSettings = globalSettings.updateGlobalSetting(key, value);
      return await globalSettingsRepository.save(newGlobalSettings);
    }
  );

}
