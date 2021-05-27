import { BrowserWindow, MenuItem, remote } from "electron";

interface EmptySpaceContextMenuArgs {
  handleClickAddColumnSpace: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
}

export const showEmptySpaceContextMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>, args: EmptySpaceContextMenuArgs) => {

  const MenuItem = remote.MenuItem;
  const contextMenu = new remote.Menu();

  contextMenu.append(new MenuItem({
    label: "新規カラムスペース",
    click: args.handleClickAddColumnSpace,
  }));

  contextMenu.popup({window: remote.getCurrentWindow()});
}