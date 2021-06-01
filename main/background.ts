import { app, nativeTheme } from 'electron';
import serve from 'electron-serve';
import { createWindow, registerIpc, registerEvents, registerMenus } from './helpers';

const darkBackgroundColor = 'black';
const lightBackgroundColor = 'white';

const isProd: boolean = process.env.NODE_ENV === 'production';
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
}

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')}`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    minWidth: 1000,
    height: 600,
    minHeight: 500,
    frame: false,
    show: false,
    backgroundColor: nativeTheme.shouldUseDarkColors ? darkBackgroundColor : lightBackgroundColor,
    webPreferences: {
      contextIsolation: false,  //レンダラープロセスでnode.jsのAPIを使いたかった
      nodeIntegration: true,    //レンダラープロセスでnode.jsのAPIを使いたかった
      webSecurity: false,       //ファイルアップロード時のプレビューのために使用。これがfalseなのが嫌ならそこを修正する
      enableRemoteModule: true, //どうしてもコンテキストメニューのあれこれのために、レンダラープロセスからremoteを使う必要があった。これがtrueなのが嫌なら頑張る
    }

    // transparent: true,
    // resizable: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

registerIpc();
registerEvents();
// registerMenus();
