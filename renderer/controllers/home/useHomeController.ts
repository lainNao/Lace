import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import useSetupColumnSpaces from '../../hooks/useSetupColumnSpaces';
import useSetupDisplaySettings from '../../hooks/useSetupDisplaySettings';
import useSetupRelatedCells from '../../hooks/useSetupRelatedCells';

export const useHomeController = () => {
  const [columnSpaces, setColumnSpaces] = useSetupColumnSpaces();
  const [relatedCells, setRelatedCells] = useSetupRelatedCells();
  const [displaySettings, setDisplaySettings] = useSetupDisplaySettings();
  const isInitializeFinished = columnSpaces;


  return {
    // データ
    columnSpaces,
    isInitializeFinished,
  }
}