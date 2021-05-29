import { BrowserWindow, MenuItem, remote } from "electron";

interface ColumnContextMenuArgs {
  handleClickUpdateCell?: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickRenameCell?: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickDeleteCell: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickUpdateRelation: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleMenuWillClose: () => void,
}

export const showCellContextMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>, args: ColumnContextMenuArgs) => {

  const MenuItem = remote.MenuItem;
  const contextMenu = new remote.Menu();

  if (args.handleClickRenameCell) {
    // リネームがある時はファイルということなので、ファイル編集は現状できないのでリネームを出す
    contextMenu.append(new MenuItem({
      label: "リネーム",
      click: args.handleClickRenameCell,
    }));
  } else {
    // リネームがない時は編集を出す
    contextMenu.append(new MenuItem({
      label: "編集",
      click: args.handleClickUpdateCell,
    }));
  }
  contextMenu.append(new MenuItem({
    label: "リレーション管理",
    click: args.handleClickUpdateRelation,
  }));
  contextMenu.append(new MenuItem({
    type: 'separator'
  }));
  contextMenu.append(new MenuItem({
    label: "削除",
    click: args.handleClickDeleteCell,
  }));

  contextMenu.popup({window: remote.getCurrentWindow()});

  contextMenu.on("menu-will-close", args.handleMenuWillClose)
}
