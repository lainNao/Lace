import electron from "electron";

//todo 一度読んだらキャッシュ
export const getUserdataPath = async(): Promise<string> => {
  return electron.ipcRenderer.invoke('read-userdata-path');
}
