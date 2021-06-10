import { useEffect, useRef, useState } from 'react';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import { Cell } from '../../models/ColumnSpaces';
import columnSpacesState from '../../recoils/atoms/columnSpacesState';
import displaySettingsState from '../../recoils/atoms/displaySettingsState';
import relatedCellsState from '../../recoils/atoms/relatedCellsState';
import displayTargetColumnSpaceIdState from '../../recoils/atoms/displayTargetColumnSpaceIdState';
import specificColumnSpaceState from '../../recoils/selectors/specificColumnSpaceState';
import { mainPaneDataTransformer, MainPaneDataTransformerData } from '../../transformers/mainPaneDataTransformer';

export const useColumnSpaceDisplayerController = () => {
  const [columnSpaces, setColumnSpaces] = useRecoilState(columnSpacesState);
  const [relatedCells, setRelatedCells] = useRecoilState(relatedCellsState);
  const [displaySettings, setDisplaySettings] = useRecoilState(displaySettingsState);
  const [displayTargetColumnSpaceId, setDisplayTargetColumnSpaceId] = useRecoilState(displayTargetColumnSpaceIdState)
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [targetCell, setTargetCell] = useState<Cell>(null);
  const [mainPaneData, setMainPaneData] = useState<MainPaneDataTransformerData>(null)
  const lastPlayedAudioDetails = useRef(null);
  const currentSelectedColumnSpace = useRecoilValue(specificColumnSpaceState(displayTargetColumnSpaceId));

  // メインパネルのデータ読み込み
  useEffect(() => {
    setMainPaneData(null);

    if (!(columnSpaces && relatedCells && displaySettings && displayTargetColumnSpaceId && displaySettings.children[displayTargetColumnSpaceId])) {
      return;
    }

    (async() => {
      const mainPaneData = await mainPaneDataTransformer(
        columnSpaces.findDescendantColumnSpace(displayTargetColumnSpaceId),
        displaySettings.children[displayTargetColumnSpaceId],
        relatedCells,
      );
      setMainPaneData(mainPaneData);
    })()

  }, [columnSpaces, relatedCells, displaySettings, displayTargetColumnSpaceId]);

  const handleDisplaySettingChange = useRecoilCallback(({snapshot, set}) => async (tabIndex: number) => {
    console.debug("表示設定のタブ選択変更");
    setTargetCell(null);
    setTabIndex(tabIndex)
  }, []);

  const handleClickMainCell = (event, cell: Cell) => {
    console.debug("中央paneセルをclick");
    setTargetCell(cell);
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

  const handleVideoCellToggle = (event) => {
    const target = event.target;

    /// 閉じた場合
    if (target.dataset.isOpening == "true") {
      console.debug("Videoセルをトグルでclose");
      target.dataset.isOpening = "false";

      // 停止
      target.querySelector("video").pause();
      return;
    }

    /// 開いた場合場合
    console.debug("Videoセルをトグルでopen");
    target.dataset.isOpening = "true";
  }

  return {
    // データ
    columnSpaces,
    relatedCells,
    displaySettings,
    displayTargetColumnSpaceId,
    currentSelectedColumnSpace,
    hasInitialized: columnSpaces && relatedCells && displaySettings,
    tabIndex,
    targetCell,
    mainPaneData,
    // イベントハンドラ
    handleDisplaySettingChange,
    handleClickMainCell,
    handleSoundCellToggle,
    handleSoundPlay,
    handleSoundPause,
    handleVideoCellToggle,
  }
}