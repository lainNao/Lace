import { BrowserWindow, MenuItem, remote } from "electron";

interface ColumnContextMenuArgs {
  handleClickDeleteColumn: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => void,
}

export const showColumnContextMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>, args: ColumnContextMenuArgs) => {

  const MenuItem = remote.MenuItem;
  const dialog = remote.dialog;
  const contextMenu = new remote.Menu();

  contextMenu.append(new MenuItem({
    label:"セルの追加（未実装）",
  }));
  contextMenu.append(new MenuItem({
    label:"カラム名の変更（未実装）（これはf2でも発火するようにして）",
  }));
  contextMenu.append(new MenuItem({
    label:"メイン表示カラムに設定（未実装）",
  }));
  contextMenu.append(new MenuItem({
    label:"ソートカラムに設定（未実装）（複数段のソートカラムの設定ができるように、押下後にモーダルを出してそこで決める）",
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
