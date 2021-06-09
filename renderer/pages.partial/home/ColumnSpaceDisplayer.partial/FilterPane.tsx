import { ColumnSpace } from "../../../models/ColumnSpaces"
import { DisplaySetting } from "../../../models/DisplaySettings"
import { Tag } from "@chakra-ui/react"
import ReactLoading from "react-loading";
import { useFilterPaneData } from "../../../hooks/useFilterPaneData";

type Props = {
  className: string;
  displaySetting: DisplaySetting;
  columnSpace: ColumnSpace;
  onFilterUpdate: (checkedCellIds: {
    [columnId: string] : string[]
  }) => void;
}

export const FilterPane = (props: Props) => {

  return (
    <div>フィルターペイン</div>
  )

}

/*
  // const [filterPaneData, subColumns] = useFilterPaneData(null);

  return (
    <div className={`${props.className}`} />
  )

  // まだ読み込みが完了してない場合
  if (!filterPaneData) {
    return (
      <div className="w-full">
        <ReactLoading type="bubbles" />
      </div>
    )
  }

  return (
    <div className={`${props.className}`}>

      <div className="mb-3"><Tag colorScheme="cyan">フィルター</Tag></div>

      {subColumns.map((subColumn, currentColumnIndex) => {
        return (
          <div key={subColumn.id}>
            //  TODO カラム名で折りたたみできるようにしておく
            //カラム名
            <div></div>

            {/* 関連セル
            <div>
              {subColumn.name}
            </div>
          </div>
        )
      })}
    </div>
  )

*/