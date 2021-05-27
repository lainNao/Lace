import { BrowserWindow, MenuItem, remote } from "electron";

interface ColumnContextMenuArgs {
  handleClickCreateNewCell: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickRenameColumn: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickDeleteColumn: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
}

export const showColumnContextMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>, args: ColumnContextMenuArgs) => {

  const MenuItem = remote.MenuItem;
  const contextMenu = new remote.Menu();

  contextMenu.append(new MenuItem({
    label:"セルの管理",
    click: args.handleClickCreateNewCell,
  }));
  contextMenu.append(new MenuItem({
    label:"カラム名の変更",
    click: args.handleClickRenameColumn,
  }));
  contextMenu.append(new MenuItem({
    type: 'separator'
  }));
  contextMenu.append(new MenuItem({
    label:"削除",
    click: args.handleClickDeleteColumn,
  }));

  contextMenu.popup({window: remote.getCurrentWindow()});
}
