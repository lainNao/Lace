

import { useRecoilState } from 'recoil';
import useSetupColumnSpaces from '../hooks/useSetupColumnSpaces';
import useSetupDisplaySettings from '../hooks/useSetupDisplaySettings';
import useSetupGlobalSettings from '../hooks/useSetupGlobalSettings';
import useSetupRelatedCells from '../hooks/useSetupRelatedCells';import { useEffect } from "react";
import { GlobalSettingsRepositoryJson } from "../repositories/GlobalSettingsRepositoryJson";

//TODO ここらへんはDBファイルとかのカスタムパス保存を実装してから実装するやつ
export default function useSetupDB() {

  const [columnSpaces, setColumnSpaces] = useSetupColumnSpaces();
  const [relatedCells, setRelatedCells] = useSetupRelatedCells();
  const [displaySettings, setDisplaySettings] = useSetupDisplaySettings();
  // const [globalSettings, setGlobalSettings] = useSetupGlobalSettings();
  // const hasInitialized = columnSpaces && relatedCells && displaySettings && globalSettings;
  const hasInitialized = columnSpaces && relatedCells && displaySettings;

  useEffect(() => {
    (async() => {
      // //それぞれファイルを参照し、無かったらファイル作成
      // const globalSettingsRepository = new GlobalSettingsRepositoryJson();
      // const globalSettings = await globalSettingsRepository.read();
      // setGlobalSettings(globalSettings);
    })()
  }, []);

  return hasInitialized;

}