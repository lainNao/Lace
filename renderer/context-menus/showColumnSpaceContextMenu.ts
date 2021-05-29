import { BrowserWindow, MenuItem, remote } from "electron";

interface ColumnSpaceContextMenuArgs {
  handleClickDeleteColumnSpace: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
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
    label: "リレーション管理",
    click: args.handleClickRelateCells,
    enabled: (args.targetColumnSpaceDataset.hasColumns === "true"),
  }));
  contextMenu.append(new MenuItem({
    label: "表示形式の管理（TODO）",
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