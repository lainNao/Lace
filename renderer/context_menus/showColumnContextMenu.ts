import { remote } from "electron";

export const showColumnContextMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {

  const MenuItem = remote.MenuItem;
  const dialog = remote.dialog;
  const contextMenu = new remote.Menu();
  contextMenu.append(new MenuItem({
    label:"カラムを右クリしました",
  }));
  contextMenu.append(new MenuItem({
    label:"テスト1",
    click:()=>{
      dialog.showMessageBox({message:"コンテキストメニュー:テスト1クリック"})
    }
  }));
  contextMenu.append(new MenuItem({
    label:"テスト２",
    click:()=>{
      dialog.showMessageBox({message:"コンテキストメニュー:テスト２クリック"})
    }
  }));
  contextMenu.popup({window: remote.getCurrentWindow()});
}
