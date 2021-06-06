import { useState } from 'react';
import { useRecoilCallback, useRecoilState } from 'recoil';
import columnSpacesState from '../../recoils/atoms/columnSpacesState';
import displaySettingsState from '../../recoils/atoms/displaySettingsState';
import relatedCellsState from '../../recoils/atoms/relatedCellsState';
import selectedColumnSpaceIdState from '../../recoils/atoms/selectedColumnSpaceIdState';

export const useColumnSpaceDisplayerController = () => {
  const [columnSpaces, setColumnSpaces] = useRecoilState(columnSpacesState);
  const [relatedCells, setRelatedCells] = useRecoilState(relatedCellsState);
  const [displaySettings, setDisplaySettings] = useRecoilState(displaySettingsState);
  const [selectedColumnSpaceId, setSelectedColumnSpaceId] = useRecoilState(selectedColumnSpaceIdState)
  const [tabIndex, setTabIndex] = useState(0);
  const [targetCellId, setTargetCellId] = useState(null);

  const handleDisplaySettingChange = useRecoilCallback(({snapshot, set}) => async (tabIndex: number) => {
    console.debug("表示設定のタブ選択変更");
    setTabIndex(tabIndex)
  }, []);

  const handleOnMouseMainCell = (event, cellId: string) => {
    console.debug("中央paneセルにonmouse");
    console.log(event, cellId)
    // setTargetCellId(cellId);
  }

  const handleFilterUpdate = (checkedCellIds: {
    [columnId: string] : string[]
  }) => {
    console.debug("フィルター条件更新");
    console.log(checkedCellIds);
  }

  return {
    // データ
    columnSpaces,
    relatedCells,
    displaySettings,
    selectedColumnSpaceId,
    hasInitialized: columnSpaces && relatedCells && displaySettings,
    tabIndex,
    targetCellId,
    // イベントハンドラ
    handleDisplaySettingChange,
    handleFilterUpdate,
    handleOnMouseMainCell,
  }
}