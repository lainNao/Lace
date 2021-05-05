import createWindow from './create-window';
import { app, ipcMain, BrowserWindow } from 'electron'
import fs from 'fs';
import path from 'path';

// ユーザーデータのパスを返す
ipcMain.handle('read-userdata-path', async (event) => {
  return app.getPath('userData');
})

export {
  createWindow,
};
