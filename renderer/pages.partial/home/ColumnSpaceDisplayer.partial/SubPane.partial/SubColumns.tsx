
import { Cell, Column, ColumnSpace } from "../../../../models/ColumnSpaces"
import { DisplaySetting } from "../../../../models/DisplaySettings"
import { CellDataType, cellDataTypeIcons } from "../../../../resources/CellDataType"
import { CellViewer } from "../../../../components/CellViewer"
import { CellViewerHorizontal } from "../../../../components/CellViewerHorizontal"
import { useRecoilValue } from "recoil"
import relatedCellsState from "../../../../recoils/atoms/relatedCellsState"
import { RelatedCellDisplayDirectionType } from "../../../../models/DisplaySettings/RelatedCellsDisplaySetting"
import React, { useEffect, useState } from "react"
import ReactLoading from "react-loading";

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
  const relatedCells = useRecoilValue(relatedCellsState);
  const [relatedCellsAndColumnSpaceSettingArray , setRelatedCellsAndColumnSpaceSettingArray] = useState(null);

  // データ読み込み
  useEffect(() => {
    (async() => {
      const getRelatedCellsAndColumnSpaceSettingArray = () => new Promise(async(resolve, reject) => {
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
      setRelatedCellsAndColumnSpaceSettingArray(null);
      const result = await getRelatedCellsAndColumnSpaceSettingArray();
      // 読み込み結果を反映
      setRelatedCellsAndColumnSpaceSettingArray(result);
    })();
  }, [props.targetCell.id]);

  // まだ読み込みが完了してない場合
  if (!relatedCellsAndColumnSpaceSettingArray) {
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
            {relatedCellsAndColumnSpaceSettingArray[currentColumnIndex].relatedCells.length === 0 && (
              <div className="ml-8">
                <div className="select-none">-</div>
              </div>
            )}

            {/* 関連セルがあり、Verticalの場合 */}
            {(relatedCellsAndColumnSpaceSettingArray[currentColumnIndex].relatedCells.length !== 0 && relatedCellsAndColumnSpaceSettingArray[currentColumnIndex].displaySetting.direction === RelatedCellDisplayDirectionType.Vertical) && (
              <div className="ml-8 mt-1">
                {relatedCellsAndColumnSpaceSettingArray[currentColumnIndex].relatedCells.map(cell => {
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
            {(relatedCellsAndColumnSpaceSettingArray[currentColumnIndex].relatedCells.length !== 0 && relatedCellsAndColumnSpaceSettingArray[currentColumnIndex].displaySetting.direction === RelatedCellDisplayDirectionType.Horizontal) && (
              <div className="ml-8 mt-1">
                {relatedCellsAndColumnSpaceSettingArray[currentColumnIndex].relatedCells.map((cell, index) => {
                  return (
                    <React.Fragment key={cell.id}>
                      <CellViewerHorizontal
                        tooltipId={index + "-" + subColumn.id + "-"+ cell.id}   //TODO ここもう少しどうにかする　本当はindexの代わりに表示設定IDとかほしいところ　いずれキャッシュ制御で生成するようにするなら表示設定IDも必要になるだろうし
                        displayType={relatedCellsAndColumnSpaceSettingArray[currentColumnIndex].displaySetting.hListDisplayType}
                        key={cell.id}
                        className="mb-2"
                        cell={cell}
                        withBackgroundHoveredColor={true}
                      />
                      {index !== relatedCellsAndColumnSpaceSettingArray[currentColumnIndex].relatedCells.length-1 &&
                        <span className="mx-1 select-none">{relatedCellsAndColumnSpaceSettingArray[currentColumnIndex].displaySetting.hListSeparator}</span>
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