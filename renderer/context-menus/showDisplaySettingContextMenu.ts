import { BrowserWindow, MenuItem, remote } from "electron";

interface DisplaySettingContextMenuArgs {
  handleClickUpdateDisplaySetting: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickDeleteDisplaySetting: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleMenuWillClose: () => void,
}

export const showDisplaySettingContextMenu = (args: DisplaySettingContextMenuArgs) => {

  const MenuItem = remote.MenuItem;
  const contextMenu = new remote.Menu();

  contextMenu.append(new MenuItem({
    label: "編集",
    click: args.handleClickUpdateDisplaySetting,
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
