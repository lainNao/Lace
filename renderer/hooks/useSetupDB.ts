

import { ColumnSpacesRepositoryJson } from '../repositories/ColumnSpacesRepositoryJson';
import { useRecoilState } from 'recoil';
import columnSpacesState from '../recoils/atoms/columnSpacesState';
import relatedCellsState from '../recoils/atoms/relatedCellsState';
import { RelatedCellsRepositoryJson } from '../repositories/RelatedCellsRepositoryJson';
import { DisplaySettingsRepositoryJson } from '../repositories/DisplaySettingsRepositoryJson';
import globalSettingsState from '../recoils/atoms/globalSettingsState';
import { GlobalSettingKeys } from '../models/GlobalSettings/GlobalSettings';
import { LocalStorageKeys } from '../resources/enums/app';
import { GlobalSettingsRepositoryJson } from '../repositories/GlobalSettingsRepositoryJson';
import displaySettingsState from '../recoils/atoms/displaySettingsState';
import { useEffect, useState } from 'react';

//TODO ここらへんはDBファイルとかのカスタムパス保存を実装してから実装するやつ
export default function useSetupDB() {

  const [columnSpaces, setColumnSpaces] = useRecoilState(columnSpacesState);
  const [relatedCells, setRelatedCells] = useRecoilState(relatedCellsState);
  const [globalSettings, setGlobalSettings] = useRecoilState(globalSettingsState);
  const [displaySettings, setDisplaySettings] = useRecoilState(displaySettingsState);
  const [hasLoaded, setHasLoaded] = useState(null);
  const [hasError, setHasError] = useState(null);

  useEffect(() => {
    (async() => {
      try {
        // 全DBの読み込み
        const columnSpacesRepository = new ColumnSpacesRepositoryJson();
        const columnSpaces = await columnSpacesRepository.read()
        setColumnSpaces(columnSpaces)

        const relatedCellsRepository = new RelatedCellsRepositoryJson();
        const relatedCells = await relatedCellsRepository.read();
        setRelatedCells(relatedCells)

        const displaySettingsRepository = new DisplaySettingsRepositoryJson();
        const displaySettings = await displaySettingsRepository.read();
        setDisplaySettings(displaySettings)

        const globalSettingsRepository = new GlobalSettingsRepositoryJson();
        const globalSettings = await globalSettingsRepository.read();
        setGlobalSettings(globalSettings);

        setHasLoaded(true);
      } catch (e) {
        // 失敗したらDBが無いかなんらかの異常なので、初期化をユーザーにうながす
        setHasError(true);
      }
    })()
  }, [])

  // DBファイルの保存先は変更があるたびにlocalStorageに反映
  //TODO これはここに書くもの感薄いので考える
  useEffect(() => {
    if (!globalSettings?.data?.[GlobalSettingKeys.CUSTOM_SAVE_DIR_PATH]) {
      return;
    }
    localStorage.setItem(LocalStorageKeys.CUSTOM_SAVE_DIR_PATH, globalSettings.data?.[GlobalSettingKeys.CUSTOM_SAVE_DIR_PATH]);
  }, [globalSettings?.data?.[GlobalSettingKeys.CUSTOM_SAVE_DIR_PATH]])

  return [hasLoaded, hasError];

}