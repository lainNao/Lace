import { useRecoilState } from "recoil";
import globalSettingsState from "../recoils/atoms/globalSettingsState";
import { useEffect } from "react";
import { GlobalSettingsRepositoryJson } from "../repositories/GlobalSettingsRepositoryJson";

export default function useSetupGlobalSettings() {

  const [globalSettings, setGlobalSettings] = useRecoilState(globalSettingsState);

  useEffect(() => {
    (async() => {
      const globalSettingsRepository = new GlobalSettingsRepositoryJson();
      const globalSettings = await globalSettingsRepository.read();
      setGlobalSettings(globalSettings);
    })()
  }, []);

  return [globalSettings, setGlobalSettings] as const;

}