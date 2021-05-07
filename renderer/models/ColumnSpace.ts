import { v4 as uuidv4 } from 'uuid'
import { Columns } from './Columns';
import { ColumnSpaces } from './ColumnSpaces';

interface ColumnSpaceConstructorArgs {
  id?: string,
  name: string,
  childColumnSpaces: ColumnSpaces,
  columns: Columns,
}

export class ColumnSpace {

  id: string;
  name: string;
  childColumnSpaces: ColumnSpaces;
  columns: Columns;

  constructor(args: ColumnSpaceConstructorArgs) {
    const id = args.id ?? uuidv4();
    //TODO 既に同じIDが存在するか確認（そこまでする必要ある？保存時に確認…？うーん）。他各種不変条件
    //TODO nameの左右のスペースはここでトリムしてしまってよいかな…？ファクトリー作る…？後に対応…

    this.id = id;
    this.name = args.name;
    this.childColumnSpaces = args.childColumnSpaces;
    this.columns = args.columns;
  }

  canAddChildColumnSpace() {
    return (
      this.childColumnSpaces.children.length > 0
    )
  }

  hasColumns(): boolean {
    return (this.columns == null || this.columns.children.length > 0)
  }

}