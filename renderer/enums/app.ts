export enum FileSystemEnum {
  ColumnSpace,
  Column,
  Cell,
}

export enum ColumnDataType {
  File = 0,   //これ「Sound」「Image」「Video」とかに分けなくて大丈夫？
  PlainText = 1,
  Markdown = 2,
  Radio = 3,
  Boolean = 4,
  //TODO 随時追加　ただしenumだから既にあるのの前に追加とかできなくなるので注意
}