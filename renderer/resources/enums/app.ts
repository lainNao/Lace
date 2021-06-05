export enum FileSystemEnum {
  ColumnSpace,
  Column,
  Cell,
}

export enum DbFileNameEnum {
  COLUMN_SPACES = "column_spaces.json",
  RELATED_CELLS = "related_cells.json",
  DISPLAY_SETTINGS = "display_settings.json",
  GLOBAL_SETTINGS = "global_settings.json",
}

export enum LocalStorageKeys {
  CUSTOM_SAVE_DIR_PATH = "customSaveDirPath", //ユーザが変更したセーブディレクトリのパス
  EXPANDED_COLUMN_SPACES = "expandedColumnSpaces", //展開しているカラムスペースのIDリスト
  HAS_ONCE_INITIALIZED = "hasOnceInitialized",  //「初期化したことあるのにDB読み込みエラーが起きたとき」の判別に使う
}