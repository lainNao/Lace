import { app, ipcMain } from 'electron';
import path from "path";

export default function registerIpc() {

  // ユーザーデータのパスを返す
  ipcMain.handle('read-userdata-path', async (event) => {
    return app.getPath('userData');
  })

  // 基本データの保存先のパスを返す
  ipcMain.handle("read-save-dir-path", async (evnet) => {
    return path.join(app.getPath("documents"), app.getName());
  })

}

