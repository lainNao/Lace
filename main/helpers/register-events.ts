import { app } from 'electron'

export default function registerEvents() {

  app.on('window-all-closed', () => {
    app.quit();
  });

}