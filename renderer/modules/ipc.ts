import electron from "electron";
import { LocalStorageKeys } from "../resources/enums/app";

//TODO 一度読んだらキャッシュ　あと名前紛らわしいからどうにかする
export const getUserdataPath = async(): Promise<string> => {
  return electron.ipcRenderer.invoke('read-userdata-path');
}

export const getSaveDirPath = async(): Promise<string> => {
  // 保存先ディレクトリの設定をしてるならそこから読み込む
  if (localStorage.getItem(LocalStorageKeys.CUSTOM_SAVE_DIR_PATH)) {
    return localStorage.getItem(LocalStorageKeys.CUSTOM_SAVE_DIR_PATH);
  }

  return electron.ipcRenderer.invoke('read-save-dir-path');
}
