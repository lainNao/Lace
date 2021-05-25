import { BrowserWindow, MenuItem, remote } from "electron";

interface ColumnContextMenuArgs {
  handleClickUpdateCell: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickDeleteCell: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickUpdateRelation: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleMenuWillClose: () => void,
}

export const showCellContextMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>, args: ColumnContextMenuArgs) => {

  const MenuItem = remote.MenuItem;
  const dialog = remote.dialog;
  const contextMenu = new remote.Menu();

  contextMenu.append(new MenuItem({
    label:"編集",
    click: args.handleClickUpdateCell,
  }));
  contextMenu.append(new MenuItem({
    label: "関連セルの紐付け",
    click: args.handleClickUpdateRelation,
  }));
  contextMenu.append(new MenuItem({
    type: 'separator'
  }));
  contextMenu.append(new MenuItem({
    label:"削除",
    click: args.handleClickDeleteCell,
  }));

  contextMenu.popup({window: remote.getCurrentWindow()});

  contextMenu.on("menu-will-close", args.handleMenuWillClose)
}
