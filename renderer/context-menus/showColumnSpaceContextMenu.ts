import { BrowserWindow, MenuItem, remote } from "electron";

interface ColumnSpaceContextMenuArgs {
  handleClickDeleteColumnSpace: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickAddChildColumnSpace: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  handleClickAddChildColumn: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
  targetColumnSpaceDataset: any,
}

export const showColumnSpaceContextMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>, args: ColumnSpaceContextMenuArgs) => {

  const MenuItem = remote.MenuItem;
  const contextMenu = new remote.Menu();

  if (args.targetColumnSpaceDataset.hasColumns === "true") {
    // 子columnがある時

    contextMenu.append(new MenuItem({
      label:"カラムの追加",
      click: args.handleClickAddChildColumn,
    }));
  } else {
    // 子columnが無い時

    contextMenu.append(new MenuItem({
      label:"カラムスペースの追加",
      click: args.handleClickAddChildColumnSpace,
    }));

    if (args.targetColumnSpaceDataset.hasChildColumnSpaces === "false") {
      // 子childSpaceも無い時

      contextMenu.append(new MenuItem({
        label:"カラムの追加",
        click: args.handleClickAddChildColumn,
      }));
    }

  }

  contextMenu.append(new MenuItem({
    label:"削除",
    click: args.handleClickDeleteColumnSpace,
  }));

  contextMenu.popup({window: remote.getCurrentWindow()});
}