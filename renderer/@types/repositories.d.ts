
export interface IHomeRepository {

  // 現芸のカラムスペースのUUID
  currentColumnSpaceUUID: string;
  // DBファイルのパス
  dbFilePath: string;
  // publicフォルダのパス
  publicPath: string;
  // メモリ上に読み込んだDB
  columnSpaceDB: columnspaceDBType;
  // 初期状態のDB（後で別ファイルに移したり、あと「test_column_space」とか「test_file_column_uuid」とかを動的にする
  initialDB: columnspaceDBType;

  readOrCreateDB(): Promise<columnspaceDBType> ;
  readDB: () => Promise<columnspaceDBType> ;
  createDB: () => Promise<any>;
  uploadFile: (fileObject, targetColumnUUID) => Promise<columnspaceDBType> ;
  getSavePathWithoutDuplication: (filenameWithExtension, targetColumnUUID) => Promise<string>;

}