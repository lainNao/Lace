
import { Cell, Column, ColumnSpace } from "../../../../models/ColumnSpaces"
import { DisplaySetting } from "../../../../models/DisplaySettings"
import { CellDataType, cellDataTypeIcons } from "../../../../resources/CellDataType"
import { CellViewer } from "../../../../components/CellViewer"
import { CellViewerHorizontal } from "../../../../components/CellViewerHorizontal"
import { RelatedCellDisplayDirectionType } from "../../../../models/DisplaySettings/RelatedCellsDisplaySetting"
import React from "react"
import ReactLoading from "react-loading";
import { useSubColumnsData } from "../../../../hooks/useSubColumnsData"

type SubColumnsProps = {
  subColumns: Column[],
  columnSpace: ColumnSpace,
  displaySetting: DisplaySetting,
  targetCell: Cell,
  onSoundCellToggle: (event) => void,
  onSoundCellPlay: (event) => void,
  onSoundCellPause: (event) => void,
  onVideoCellToggle: (event) => void,
}

// TODO メモ化とかも考えたけどpropsが多すぎて再レンダリング必要かどうかの比較するのも計算コストかかりそうだったので一旦略してる
export const SubColumns = (props: SubColumnsProps) => {

  const subColumnsData = useSubColumnsData({
    subColumns: props.subColumns,
    columnSpace: props.columnSpace,
    displaySetting: props.displaySetting,
    targetCell: props.targetCell,
  });

  // まだ読み込みが完了してない場合
  if (!subColumnsData) {
    return (
      <div className="w-full">
        <ReactLoading type="bubbles" />
      </div>
    )
  }

  // 読み込み完了した場合
  return (
    <div className="">
      {props.subColumns.map((subColumn, currentColumnIndex) => {
        // 中央ペインでonmouseしているセルIDと関連しているセルだけフィルタリング。これがそれなりにたぶんコスト高い

        return (
          <div key={subColumn.id} className="mb-4">

            {/* カラム名 */}
            <div className="font-bold flex items-center">
              <span>{cellDataTypeIcons(subColumn.type, "w-3 h-3 mr-2")}</span>
              <span className="font-sans text-blue-400 text-sm">{subColumn.name}</span>
            </div>

            {/* 関連セルが無い場合 */}
            {subColumnsData[currentColumnIndex].relatedCells.length === 0 && (
              <div className="ml-8">
                <div className="select-none">-</div>
              </div>
            )}

            {/* 関連セルがあり、Verticalの場合 */}
            {(subColumnsData[currentColumnIndex].relatedCells.length !== 0 && subColumnsData[currentColumnIndex].displaySetting.direction === RelatedCellDisplayDirectionType.Vertical) && (
              <div className="ml-8 mt-1">
                {subColumnsData[currentColumnIndex].relatedCells.map(cell => {
                  return (
                    <CellViewer
                      key={cell.id}
                      className="mb-2"
                      cell={cell}
                      withLiPrefix={cell.type === CellDataType.Text}
                      onSoundCellToggle={props.onSoundCellToggle}
                      onSoundCellPlay={props.onSoundCellPlay}
                      onSoundCellPause={props.onSoundCellPause}
                      onVideoCellToggle={props.onVideoCellToggle}
                    />
                  )
                })}
              </div>
            )}

            {/* 関連セルがあり、Horizontalの場合 */}
            {(subColumnsData[currentColumnIndex].relatedCells.length !== 0 && subColumnsData[currentColumnIndex].displaySetting.direction === RelatedCellDisplayDirectionType.Horizontal) && (
              <div className="ml-8 mt-1">
                {subColumnsData[currentColumnIndex].relatedCells.map((cell, index) => {
                  return (
                    <React.Fragment key={cell.id}>
                      <CellViewerHorizontal
                        tooltipId={index + "-" + subColumn.id + "-"+ cell.id}   //TODO ここもう少しどうにかする　本当はindexの代わりに表示設定IDとかほしいところ　いずれキャッシュ制御で生成するようにするなら表示設定IDも必要になるだろうし
                        displayType={subColumnsData[currentColumnIndex].displaySetting.hListDisplayType}
                        key={cell.id}
                        className="mb-2"
                        cell={cell}
                        withBackgroundHoveredColor={true}
                      />
                      {index !== subColumnsData[currentColumnIndex].relatedCells.length-1 &&
                        <span className="mx-1 select-none">{subColumnsData[currentColumnIndex].displaySetting.hListSeparator}</span>
                      }
                    </React.Fragment>
                  )
                })}
              </div>
            )}

          </div>
        )
      })}
    </div>


  )
}