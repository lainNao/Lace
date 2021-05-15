import { CellDataType } from "./CellDataType";
import { FileSystemEnum } from "../resources/enums/app";

export interface ColumnDataset {
  id: string,
  columnSpaceId: string,
  type: FileSystemEnum,
  columnType: CellDataType,
  name: string,
}
