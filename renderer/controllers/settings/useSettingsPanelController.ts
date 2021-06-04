import { useRecoilState } from "recoil";
import globalSettingsState from "../../recoils/atoms/globalSettingsState";

export const useSettingsPanelController = () => {
  const [globalSettings, setGlobalSettings] = useRecoilState(globalSettingsState);



  return {
    globalSettings,
  }
}