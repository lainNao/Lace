import { useRecoilCallback, useRecoilState } from "recoil";
import globalSettingsState from "../../recoils/atoms/globalSettingsState";
import { remote } from "electron";
import { updateGlobalSettingUsecase } from "../../usecases/updateGlobalSettingUsecase";
import { GlobalSettingKeys } from "../../models/GlobalSettings/GlobalSettings";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { updateDbPathUsecase } from "../../usecases/updateDbPathUsecase";
import { getSaveDirPath } from "../../modules/ipc";
import { useEffect, useMemo, useState } from "react";
import { isSubDir } from "../../modules/string";
import * as packageJson from "../../../package.json"
import path from "path";
import fs from "fs";
import columnSpacesState from "../../recoils/atoms/columnSpacesState";
import { cleanUpDustBoxUsecase } from "../../usecases/cleanUpDustBoxUsecase";

export const useSettingsPanelController = () => {
  const [globalSettings, setGlobalSettings] = useRecoilState(globalSettingsState);
  const { isOpen: isOpenProgressModal, onOpen: openProgressModal, onClose: onCloseProgressModal} = useDisclosure()
  const [modalSentence, setModalSentence] = useState(null);
  const [saveDirPath, setSaveDirPath] = useState(null);
  // 他
  const toast = useToast()

  const handleClickCustomSaveDirPath = useRecoilCallback(({snapshot, set}) => async (event) => {

    //1, ディレクトリ選択ダイアログを開く
    const dialog = remote.require('electron').dialog;
    const selectedPath = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    const oldUserDirectory = await getSaveDirPath();

    const selectedDirectoryPath = selectedPath?.filePaths?.[0];
    if (!selectedDirectoryPath) {
      return;
    }
    const newCustomSaveDirPath = path.join(selectedDirectoryPath, packageJson.name) ;

    // TODO ここらへんのif文ドメイン知識流出してる気がするので対策あれば後で考えたい。単にif文をモデルのコンストラクタに噛ませばいいと思いきや変更判定ができなくてうーん。
    // NOTE: 再帰コピーにならないように、サブディレクトリの選択はできないようにする
    if (isSubDir(oldUserDirectory, newCustomSaveDirPath)) {
      toast({ title: "同一ディレクトリまたはサブディレクトリを選択することはできません", status: "error", position: "bottom-right", isClosable: true, duration: 10000,})
      return;
    }
    // Laceディレクトリが選択したディレクトリ直下にあったらかぶるのでreturn
    if (fs.existsSync(newCustomSaveDirPath)) {
      toast({ title: `選択したディレクトリ直下に既に${packageJson.name}ディレクトリが存在します`, status: "error", position: "bottom-right", isClosable: true, duration: 10000,})
      return;
    }

    setModalSentence("DBのコピー中");
    openProgressModal();
    try {
      //2, 設定の変更を適用し、 既存のDBをコピーする
      //NOTE: 移動はしてないので留意。不要なら自前で消す形を取ってもらいたい
      const [newColumnSpaces, newGlobalSettings] = await updateDbPathUsecase(GlobalSettingKeys.CUSTOM_SAVE_DIR_PATH, oldUserDirectory, newCustomSaveDirPath);
      set(globalSettingsState, newGlobalSettings);
      set(columnSpacesState, newColumnSpaces);
      toast({ title: `データベースをコピーしました。元のデータベースディレクトリ（${oldUserDirectory}）はもう不要ですが一応自動削除はしなかったので、気になる場合手動で削除してください`, status: "success", position: "bottom-right", isClosable: true, duration: null})
    } catch (e) {
      console.log(e.stack);
      toast({ title: e.message, status: "error", position: "bottom-right", isClosable: true, duration: 10000,})
    } finally {
      onCloseProgressModal();
    }

  }, []);

  const handleClickCleanUpDustBoxedFiles = useRecoilCallback(({snapshot, set}) => async (event) => {
    setModalSentence("クリーンアップ中");
    openProgressModal()
    try {
      const deletedFiles = await cleanUpDustBoxUsecase();
      toast({ title: `${deletedFiles.length}個のクリーンアップに成功しました`, status: "success", position: "bottom-right", isClosable: true, duration: 2000,});
    } catch (e) {
      toast({ title: `クリーンアップ時にエラーが発生しました`, status: "error", position: "bottom-right", isClosable: true, duration: null,});
      toast({ title: e.message, status: "error", position: "bottom-right", isClosable: true, duration: null,});
    } finally {
      onCloseProgressModal();
    }

  }, []);

  // 表示用のDBファイル保存先ディレクトリの設定を反映
  useEffect(() => {
    (async () => {
      if (globalSettings?.data?.[GlobalSettingKeys.CUSTOM_SAVE_DIR_PATH]) {
        setSaveDirPath(globalSettings?.data?.[GlobalSettingKeys.CUSTOM_SAVE_DIR_PATH]);
      } else {
        const path = await getSaveDirPath();
        setSaveDirPath(path);
      }
    })()
  }, [globalSettings?.data?.[GlobalSettingKeys.CUSTOM_SAVE_DIR_PATH]]);

  return {
    // 状態
    globalSettings,
    saveDirPath,
    modalSentence,
    // イベントハンドラ
    handleClickCustomSaveDirPath,
    handleClickCleanUpDustBoxedFiles,
    // モーダル管理
    isOpenProgressModal,
    onCloseProgressModal,
  }
}
