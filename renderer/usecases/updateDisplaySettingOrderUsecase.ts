import { DbFilesExclusiveTransaction } from "../modules/db";
import { DisplaySettings } from "../models/DisplaySettings";
import { DisplaySettingsRepositoryJson } from "../repositories/DisplaySettingsRepositoryJson";

//NOTE: 第三引数が省略されたら、第二引数のカラムを0番目に移動する
//TODO これ第三引数はインデックスのほうが普通なのでは
export const updateDisplaySettingOrderUsecase = async(columnSpaceId: string, fromIndex: number, toIndex: number): Promise<DisplaySettings> => {
  return await DbFilesExclusiveTransaction(
    async () => {
      const displaySettingsRepository = new DisplaySettingsRepositoryJson();
      const displaySettings = await displaySettingsRepository.read();
      const newDisplaySettings = displaySettings.updateDisplaySettingOrder(columnSpaceId, fromIndex, toIndex);
      return displaySettingsRepository.save(newDisplaySettings);
    }
  );

}




