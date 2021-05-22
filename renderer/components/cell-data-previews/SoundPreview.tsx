import { Cell } from "../../models/ColumnSpaces";
import { SoundCellData } from "../../models/ColumnSpaces/CellData.implemented";

type Props = {
  cell: Cell,
  className: string,
}

export const SoundPreview = (props: Props) => {
  return (
    <audio controls src={(props.cell.data as SoundCellData).path} className={props.className} />
  );
}