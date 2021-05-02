
export interface IHomeRepository {

  // 現芸のカラムスペースのUUID
  currentColumnSpaceUUID: string;
  // DBファイルのパス
  dbFilePath: string;
  // publicフォルダのパス
  publicPath: string;
  // メモリ上に読み込んだDB
  columnSpaceDB: columnSpacesType;
  // 初期状態のDB（後で別ファイルに移したり、あと「test_column_space」とか「test_file_column_uuid」とかを動的にする
  initialDB: columnSpacesType;

  readOrCreateDB(): Promise<columnSpacesType> ;
  readDB: () => Promise<columnSpacesType> ;
  createDB: () => Promise<columnSpacesType>;
  addColumnSpace: (columnSpaceName: string) => Promise<columnSpacesType>;
  uploadFile: (fileObject, targetColumnUUID: string) => Promise<columnSpacesType> ;
  getSavePathWithoutDuplication: (filenameWithExtension: string, targetColumnUUID: string) => Promise<string>;

}