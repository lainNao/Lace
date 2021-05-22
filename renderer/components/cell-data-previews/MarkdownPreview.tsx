import { Cell } from "../../models/ColumnSpaces";
import { MarkdownCellData } from "../../models/ColumnSpaces/CellData.implemented";

type Props = {
  cell: Cell,
  className: string,
}

export const MarkdownPreview = (props: Props) => {
  return (
    <div className={`${props.className} cursor-pointer`} onClick={() => alert("TODO モーダルでも開いてマークダウンをレンダリングして")}>
      「{(props.cell.data as MarkdownCellData).title}」のマークダウンのプレビュー
    </div>
  )
}