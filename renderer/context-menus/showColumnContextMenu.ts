import { remote } from "electron";

export const showColumnContextMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {

  const MenuItem = remote.MenuItem;
  const dialog = remote.dialog;
  const contextMenu = new remote.Menu();

  contextMenu.append(new MenuItem({
    label:"セルの追加（未実装）",
  }));
  contextMenu.append(new MenuItem({
    label:"カラム名の変更（未実装）（これはf2でも発火するようにして）",
  }));

  contextMenu.popup({window: remote.getCurrentWindow()});
}
