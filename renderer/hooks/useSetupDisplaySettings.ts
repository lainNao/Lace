import { useRecoilState } from "recoil";
import displaySettingsState from "../recoils/atoms/displaySettingsState";
import { useEffect } from "react";
import { DisplaySettingsRepositoryJson } from "../repositories/DisplaySettingsRepositoryJson";

export default function useSetupDisplaySettings() {

  const [displaySettings, setDisplaySettings] = useRecoilState(displaySettingsState);

  useEffect(() => {
    (async() => {
      const displaySettingsRepository = new DisplaySettingsRepositoryJson();
      const displaySettings = await displaySettingsRepository.read();
      setDisplaySettings(displaySettings)
    })()
  }, []);

  return [displaySettings, setDisplaySettings] as const;

}