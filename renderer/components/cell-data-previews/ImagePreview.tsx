import { Cell } from "../../models/ColumnSpaces";
import { SoundCellData } from "../../models/ColumnSpaces/CellData.implemented";

type Props = {
  cell: Cell,
  className: string,
}

//TODO ライトボックスみたいに拡大できるようにする。ただし30分探してもまさかのいい感じにできるの無かった。
/* 以下駄目だったやつ
    "react-awesome-lightbox": "^1.8.0",
    "react-medium-image-zoom": "^3.1.3",
    "react-select": "^4.3.1",
    "react-simple-image-viewer": "^0.0.8",
*/
export const ImagePreview = (props: Props) => {
  return (
    <img
      src={(props.cell.data as SoundCellData).path}
      className={props.className}
    />
  )
}