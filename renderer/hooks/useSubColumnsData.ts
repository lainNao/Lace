
import { Cell, Column, ColumnSpace } from "../models/ColumnSpaces"
import { DisplaySetting } from "../models/DisplaySettings"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import relatedCellsState from "../recoils/atoms/relatedCellsState"

type Props = {
  subColumns: Column[],
  columnSpace: ColumnSpace,
  displaySetting: DisplaySetting,
  targetCell: Cell,
}

//TODO エラー処理入れたい
//TODO 型
export const useSubColumnsData = (props: Props) => {
  const relatedCells = useRecoilValue(relatedCellsState);
  const [subColumnsData , setSubcolumnsData] = useState(null);

  useEffect(() => {
    setSubcolumnsData(null);
    (async() => {
      //TODO ここクエリーサービス化するのがいいかも
      const getSubColumnsData = () => new Promise(async(resolve, reject) => {
        const targetDatas = props.subColumns.map(subColumn => {
          return {
            relatedCells: subColumn.cells.children.filter(cell =>
                relatedCells.isRelated(props.columnSpace.id,
                  { columnId: subColumn.id, cellId: cell.id },
                  { columnId: props.displaySetting.mainColumn, cellId: props.targetCell.id }
                )
              ),
            displaySetting: props.displaySetting.relatedCellsDisplaySettings.find(displaySetting => displaySetting.columnId === subColumn.id)
          }
        })
        resolve(targetDatas);
      });
      // 一旦初期化
      setSubcolumnsData(null);
      const result = await getSubColumnsData();
      // 読み込み結果を反映
      setSubcolumnsData(result);
    })();
  }, [relatedCells, props.targetCell.id]);

  return subColumnsData;
}