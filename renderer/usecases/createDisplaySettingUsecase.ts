import { DisplaySetting, DisplaySettings } from "../models/DisplaySettings";
import { DisplaySettingsRepositoryJson } from "../repositories/DisplaySettingsRepositoryJson";

export const createDisplaySettingUsecase = async(columnSpaceId: string, displaySetting: DisplaySetting): Promise<DisplaySettings> => {
  const displaySettingsRepository = new DisplaySettingsRepositoryJson();
  const displaySettings = await displaySettingsRepository.read();
  const newDisplaySettings = displaySettings.addDisplaySetting(columnSpaceId, displaySetting);
  return await displaySettingsRepository.save(newDisplaySettings);
}