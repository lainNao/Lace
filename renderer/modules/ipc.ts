import electron from "electron";

//TODO 一度読んだらキャッシュ　あと名前紛らわしいからどうにかする
export const getUserdataPath = async(): Promise<string> => {
  return electron.ipcRenderer.invoke('read-userdata-path');
}

//TODO 一度読んだらキャッシュ
export const getSaveDirPath = async(): Promise<string> => {
  return electron.ipcRenderer.invoke('read-save-dir-path');
}
