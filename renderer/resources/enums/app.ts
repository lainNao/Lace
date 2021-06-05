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
  CUSTOM_SAVE_DIR_PATH = "customSaveDirPath",
  EXPANDED_COLUMN_SPACES = "expandedColumnSpaces",
}