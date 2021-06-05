

import useSetupColumnSpaces from '../hooks/useSetupColumnSpaces';
import useSetupDisplaySettings from '../hooks/useSetupDisplaySettings';
import useSetupGlobalSettings from '../hooks/useSetupGlobalSettings';
import useSetupRelatedCells from '../hooks/useSetupRelatedCells';import { useEffect } from "react";

//TODO ここらへんはDBファイルとかのカスタムパス保存を実装してから実装するやつ
export default function useSetupDB() {

  const [columnSpaces, setColumnSpaces] = useSetupColumnSpaces();
  const [relatedCells, setRelatedCells] = useSetupRelatedCells();
  const [displaySettings, setDisplaySettings] = useSetupDisplaySettings();
  const [globalSettings, setGlobalSettings] = useSetupGlobalSettings();
  const hasInitialized = columnSpaces && relatedCells && displaySettings && globalSettings;

  return hasInitialized;

}