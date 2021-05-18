import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow, registerIpc, registerEvents, registerMenus } from './helpers';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')}`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    frame: false,
    webPreferences: {
      contextIsolation: false,  //レンダラープロセスでnode.jsのAPIを使いたかった
      nodeIntegration: true,    //レンダラープロセスでnode.jsのAPIを使いたかった
      webSecurity: false,       //ファイルアップロード時のプレビューのために使用。これがfalseなのが嫌ならそこを修正する
      enableRemoteModule: true, //どうしてもコンテキストメニューのあれこれのために、レンダラープロセスからremoteを使う必要があった。これがtrueなのが嫌なら頑張る
    }

    // transparent: true,
    // resizable: false,
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
