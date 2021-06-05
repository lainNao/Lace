import { BrowserWindow, MenuItem, remote } from "electron";

interface DisplaySettingContextMenuArgs {
  handleClickUpdateDisplaySetting: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickDeleteDisplaySetting: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickUp: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickDown: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleMenuWillClose: () => void,
  lastListIndex: number,
  targetIndex: number,
}

export const showDisplaySettingContextMenu = (args: DisplaySettingContextMenuArgs) => {

  const MenuItem = remote.MenuItem;
  const contextMenu = new remote.Menu();

  contextMenu.append(new MenuItem({
    label: "編集",
    click: args.handleClickUpdateDisplaySetting,
  }));
  contextMenu.append(new MenuItem({
    label: "1つ上に移動",
    click: args.handleClickUp,
    enabled: args.targetIndex !== 0,
  }));
  contextMenu.append(new MenuItem({
    label: "1つ下に移動",
    click: args.handleClickDown,
    enabled: args.lastListIndex !== args.targetIndex,
  }));
  contextMenu.append(new MenuItem({
    type: 'separator'
  }));
  contextMenu.append(new MenuItem({
    label: "削除",
    click: args.handleClickDeleteDisplaySetting,
  }));

  contextMenu.popup({window: remote.getCurrentWindow()});

  contextMenu.on("menu-will-close", args.handleMenuWillClose)
}
