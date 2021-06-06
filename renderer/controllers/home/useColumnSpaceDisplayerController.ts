import { useRef, useState } from 'react';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import columnSpacesState from '../../recoils/atoms/columnSpacesState';
import displaySettingsState from '../../recoils/atoms/displaySettingsState';
import relatedCellsState from '../../recoils/atoms/relatedCellsState';
import selectedColumnSpaceIdState from '../../recoils/atoms/selectedColumnSpaceIdState';
import specificColumnSpaceState from '../../recoils/selectors/specificColumnSpaceState';

export const useColumnSpaceDisplayerController = () => {
  const [columnSpaces, setColumnSpaces] = useRecoilState(columnSpacesState);
  const [relatedCells, setRelatedCells] = useRecoilState(relatedCellsState);
  const [displaySettings, setDisplaySettings] = useRecoilState(displaySettingsState);
  const [selectedColumnSpaceId, setSelectedColumnSpaceId] = useRecoilState(selectedColumnSpaceIdState)
  const [tabIndex, setTabIndex] = useState(0);
  const [targetCellId, setTargetCellId] = useState(null);
  const lastPlayedAudioDetails = useRef(null);
  const currentSelectedColumnSpace = useRecoilValue(specificColumnSpaceState(selectedColumnSpaceId));

  const handleDisplaySettingChange = useRecoilCallback(({snapshot, set}) => async (tabIndex: number) => {
    console.debug("表示設定のタブ選択変更");
    setTabIndex(tabIndex)
  }, []);

  const handleOnMouseMainCell = (event, cellId: string) => {
    console.debug("中央paneセルにonmouse");
    setTargetCellId(cellId);
  }

  const handleSoundPlay = (event) => {
    console.debug("Soundセルをplay");
    // 既に再生しているものがあったら、自分じゃないなら停止
    if (lastPlayedAudioDetails.current && (lastPlayedAudioDetails.current.querySelector("audio").dataset.cellId !== event.target.dataset.cellId)) {
      lastPlayedAudioDetails.current.querySelector("audio").pause();
    }

    // 自分を再生中にする
    lastPlayedAudioDetails.current = event.target.parentElement.parentElement;
  }

  const handleSoundPause = (event) => {
    console.debug("Soundセルをpause");

    //NOTE: 切り替える時に 新しいのをplay -> 古いのをpauseの順番に入ってしまい再生してても直後に必ずnullが入ってしまうので、以下は行わない
    // lastPlayedAudioDetails.current = null;
  }

  const handleSoundCellToggle = (event) => {
    const target = event.target;

    /// 閉じた場合
    if (target.dataset.isOpening == "true") {
      console.debug("Soundセルをトグルでclose");
      target.dataset.isOpening = "false";

      // 既に再生しているものがあったら、自分なら停止
      if (lastPlayedAudioDetails.current && (lastPlayedAudioDetails.current.querySelector("audio").dataset.cellId === target.querySelector("audio").dataset.cellId)) {
        lastPlayedAudioDetails.current.querySelector("audio").pause();
      }
      return;
    }

    /// 開いた場合場合
    console.debug("Soundセルをトグルでopen");
    target.dataset.isOpening = "true";

    // 既に再生しているものがあったら、自分じゃないなら停止
    if (lastPlayedAudioDetails.current && (lastPlayedAudioDetails.current.querySelector("audio").dataset.cellId !== target.querySelector("audio").dataset.cellId)) {
      lastPlayedAudioDetails.current.querySelector("audio").pause();
    }

    // 再生開始
    target.querySelector("audio").play();
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
    currentSelectedColumnSpace,
    hasInitialized: columnSpaces && relatedCells && displaySettings,
    tabIndex,
    targetCellId,
    // イベントハンドラ
    handleDisplaySettingChange,
    handleFilterUpdate,
    handleOnMouseMainCell,
    handleSoundCellToggle,
    handleSoundPlay,
    handleSoundPause,
  }
}