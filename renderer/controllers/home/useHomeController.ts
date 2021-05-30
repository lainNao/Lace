import useSetupColumnSpaces from '../../hooks/useSetupColumnSpaces';
import useSetupDisplaySettings from '../../hooks/useSetupDisplaySettings';
import useSetupRelatedCells from '../../hooks/useSetupRelatedCells';

export const useHomeController = () => {
  const [columnSpaces, setColumnSpaces] = useSetupColumnSpaces();
  const [relatedCells, setRelatedCells] = useSetupRelatedCells();
  const [displaySettings, setDisplaySettings] = useSetupDisplaySettings();

  return {
    columnSpaces
  }
}