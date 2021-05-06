import { remote } from "electron";

export const showColumnSpaceContextMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {

  const MenuItem = remote.MenuItem;
  const dialog = remote.dialog;
  const contextMenu = new remote.Menu();
  contextMenu.append(new MenuItem({
    label:"カラムスペースを右クリしました",
  }));
  contextMenu.append(new MenuItem({
    label:"削除",
    click:()=>{
      dialog.showMessageBox({message:"よろしいですか？的な選択肢を出したいところ。アラートマークを「削除」の左側に見せたい。あと区切り線の下に置きたい"})
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