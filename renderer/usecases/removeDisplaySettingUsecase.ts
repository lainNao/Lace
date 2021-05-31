import { DisplaySettings } from "../models/DisplaySettings";
import { DisplaySettingsRepositoryJson } from "../repositories/DisplaySettingsRepositoryJson";

export const removeDisplaySettingUsecase = async(columnSpaceId: string, displaySettingId: string): Promise<DisplaySettings> => {
  const displaySettingsRepository = new DisplaySettingsRepositoryJson();
  const displaySettings = await displaySettingsRepository.read();
  const newDisplaySettings = displaySettings.removeDisplaySettingOfSpecificDisplaySettingId(columnSpaceId, displaySettingId);
  return await displaySettingsRepository.save(newDisplaySettings);

}
