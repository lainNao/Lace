import { remote } from "electron";

export const showColumnContextMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {

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
    label:"削除（未実装）", //TODO 上に「----------」みたいな区切りを入れる。
  }));

  contextMenu.popup({window: remote.getCurrentWindow()});
}
