import { BrowserWindow, MenuItem, remote } from "electron";

interface ColumnSpaceContextMenuArgs {
  handleClickDeleteColumnSpace: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickAddChildColumnSpace: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickAddChildColumn: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickRelateCells: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  targetColumnSpaceDataset: any,
}

export const showColumnSpaceContextMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>, args: ColumnSpaceContextMenuArgs) => {

  const MenuItem = remote.MenuItem;
  const contextMenu = new remote.Menu();

  contextMenu.append(new MenuItem({
    label: "カラムスペースの追加",
    click: args.handleClickAddChildColumnSpace,
    enabled: args.targetColumnSpaceDataset.hasColumns === "false",
  }));
  contextMenu.append(new MenuItem({
    label: "カラムの追加",
    click: args.handleClickAddChildColumn,
    enabled: args.targetColumnSpaceDataset.hasChildColumnSpaces === "false",
  }));
  contextMenu.append(new MenuItem({
    label: "セル同士の関連付け",
    click: args.handleClickRelateCells,
    enabled: args.targetColumnSpaceDataset.hasChildColumnSpaces === "false",
  }));
  contextMenu.append(new MenuItem({
    type: 'separator'
  }));
  contextMenu.append(new MenuItem({
    label: "削除",
    click: args.handleClickDeleteColumnSpace,
  }));

  contextMenu.popup({window: remote.getCurrentWindow()});
}