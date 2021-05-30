import { DisplaySetting, DisplaySettings } from "../models/DisplaySettings";
import { DisplaySettingsRepositoryJson } from "../repositories/DisplaySettingsRepositoryJson";

export const updateDisplaySettingUsecase = async(columnSpaceId: string, displaySetting: DisplaySetting): Promise<DisplaySettings> => {
  const displaySettingsRepository = new DisplaySettingsRepositoryJson();
  const displaySettings = await displaySettingsRepository.read();
  const newDisplaySettings = displaySettings.updateDisplaySetting(columnSpaceId, displaySetting);
  return await displaySettingsRepository.save(newDisplaySettings);
}
