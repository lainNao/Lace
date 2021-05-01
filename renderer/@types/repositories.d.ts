
export interface IHomeRepository {
  // メモリ上に読み込んだDB
  columnSpaceDB;

  // 現芸のカラムスペースのUUID
  currentColumnSpaceUUID;

  // DBファイルのパス
  dbFilePath;

  // publicフォルダのパス
  publicPath;

  // 初期状態のDB（後で別ファイルに移したり、あと「test_column_space」とか「test_file_column_uuid」とかを動的にする
  initialDB;

  readOrCreateDB(): Promise<any>;
  readDB(): Promise<any>;
  createDB(): Promise<any>;
  uploadFile(fileObject, targetColumnUUID): Promise<any>;
  getSavePathWithoutDuplication(filenameWithExtension, targetColumnUUID);

}