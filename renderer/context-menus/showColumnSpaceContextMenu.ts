import { BrowserWindow, MenuItem, remote } from "electron";

interface ColumnSpaceContextMenuArgs {
  handleClickSetDisplayTarget: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickUp: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickDown: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickDeleteColumnSpace: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickRename: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickAddChildColumnSpace: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickAddChildColumn: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickRelateCells: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickDisplaySettings: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  targetColumnSpaceDataset: any,  //TODO さすがにこういうのは型作るか。ほぼfix状態だし。2つ似たのあると思うからいずれもそうしたい。
}

export const showColumnSpaceContextMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>, args: ColumnSpaceContextMenuArgs) => {

  const MenuItem = remote.MenuItem;
  const contextMenu = new remote.Menu();

  contextMenu.append(new MenuItem({
    label: "表示対象に設定",
    click: args.handleClickSetDisplayTarget,
    enabled: (args.targetColumnSpaceDataset.hasColumns === "true"),
  }));
  contextMenu.append(new MenuItem({
    type: 'separator'
  }));
  contextMenu.append(new MenuItem({
    label: "1つ上に移動",
    click: args.handleClickUp,
    enabled: args.targetColumnSpaceDataset.isFirstIndex !== "true",
  }));
  contextMenu.append(new MenuItem({
    label: "1つ下に移動",
    click: args.handleClickDown,
    enabled: args.targetColumnSpaceDataset.isLastIndex !== "true",
  }));
  contextMenu.append(new MenuItem({
    type: 'separator'
  }));
  contextMenu.append(new MenuItem({
    label: "追加",
    submenu: [
      {
        label: "カラムスペース",
        click: args.handleClickAddChildColumnSpace,
        enabled: args.targetColumnSpaceDataset.hasColumns === "false",
      }
      ,{
        label: "カラム",
        click: args.handleClickAddChildColumn,
        enabled: args.targetColumnSpaceDataset.hasChildColumnSpaces === "false",
      }
    ]
  }));
  contextMenu.append(new MenuItem({
    label: "リネーム",
    click: args.handleClickRename,
  }));
  contextMenu.append(new MenuItem({
    label: "リレーション管理",
    click: args.handleClickRelateCells,
    enabled: (args.targetColumnSpaceDataset.hasColumns === "true"),
  }));
  contextMenu.append(new MenuItem({
    label: "表示形式の管理",
    click: args.handleClickDisplaySettings,
    enabled: (args.targetColumnSpaceDataset.hasColumns === "true"),
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