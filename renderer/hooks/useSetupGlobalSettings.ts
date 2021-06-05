import { useRecoilState } from "recoil";
import globalSettingsState from "../recoils/atoms/globalSettingsState";
import { useEffect } from "react";
import { GlobalSettingsRepositoryJson } from "../repositories/GlobalSettingsRepositoryJson";
import { LocalStorageKeys } from "../resources/enums/app";
import { GlobalSettingKeys } from "../models/GlobalSettings/GlobalSettings";

export default function useSetupGlobalSettings() {

  const [globalSettings, setGlobalSettings] = useRecoilState(globalSettingsState);

  useEffect(() => {
    (async() => {
      const globalSettingsRepository = new GlobalSettingsRepositoryJson();
      const globalSettings = await globalSettingsRepository.read();
      setGlobalSettings(globalSettings);
    })()
  }, []);

  // DBファイルの保存先はlocalStorageに反映する
  useEffect(() => {
    if (!globalSettings?.data?.[GlobalSettingKeys.CUSTOM_SAVE_DIR_PATH]) {
      return;
    }
    localStorage.setItem(LocalStorageKeys.CUSTOM_SAVE_DIR_PATH, globalSettings.data?.[GlobalSettingKeys.CUSTOM_SAVE_DIR_PATH]);
  }, [globalSettings?.data?.[GlobalSettingKeys.CUSTOM_SAVE_DIR_PATH]])

  return [globalSettings, setGlobalSettings] as const;

}