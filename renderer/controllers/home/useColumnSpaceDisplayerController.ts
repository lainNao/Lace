import { useRecoilState } from 'recoil';
import columnSpacesState from '../../recoils/atoms/columnSpacesState';
import displaySettingsState from '../../recoils/atoms/displaySettingsState';
import relatedCellsState from '../../recoils/atoms/relatedCellsState';
import selectedColumnSpaceIdState from '../../recoils/atoms/selectedColumnSpaceIdState';

export const useColumnSpaceDisplayerController = () => {
  const [columnSpaces, setColumnSpaces] = useRecoilState(columnSpacesState);
  const [relatedCells, setRelatedCells] = useRecoilState(relatedCellsState);
  const [displaySettings, setDisplaySettings] = useRecoilState(displaySettingsState);
  const [selectedColumnSpaceId, setSelectedColumnSpaceId] = useRecoilState(selectedColumnSpaceIdState)

  return {
    // データ
    columnSpaces,
    relatedCells,
    displaySettings,
    selectedColumnSpaceId,
    hasInitialized: columnSpaces && relatedCells && displaySettings,
  }
}