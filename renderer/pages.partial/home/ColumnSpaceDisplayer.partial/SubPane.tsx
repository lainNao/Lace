import { Cell, ColumnSpace } from "../../../models/ColumnSpaces"
import { DisplaySetting } from "../../../models/DisplaySettings"
import { Tag } from "@chakra-ui/react"
import { CellDataType, cellDataTypeIcons } from "../../../resources/CellDataType"
import { CellViewer } from "../../../components/CellViewer"
import { CellViewerHorizontal } from "../../../components/CellViewerHorizontal"
import { useRecoilState } from "recoil"
import relatedCellsState from "../../../recoils/atoms/relatedCellsState"
import { RelatedCellDisplayDirectionType } from "../../../models/DisplaySettings/RelatedCellsDisplaySetting"
import React, { useMemo } from "react"

type Props = {
  className: string;
  columnSpace: ColumnSpace;
  displaySetting: DisplaySetting;
  targetCell: Cell;
  onSoundCellToggle: (event) => void;
  onSoundCellPlay: (event) => void;
  onSoundCellPause: (event) => void;
  onVideoCellToggle: (event) => void;
}

// TODO これ、onmouseが変わる度に新しく内部を生成するのかなりのコストな気がするので（高速でバンバンやられうる。CPUもったいない）、キャッシュをどうにか作ろうかな…キーをセルIDと表示設定IDにして、どちらかに変化あったらキャッシュを更新
export const SubPane = (props: Props) => {
  const [relatedCells, setRelatedCells] = useRecoilState(relatedCellsState);

  if (!props.targetCell) {
    //TODO ここもう少しどうにかする
    return <div className="text-sm">中央ペインのセルをクリックしてください</div>
  }

  // 表示設定で選択されたカラムを取得
  const subColumns = props.columnSpace.columns.children.filter(column => {
    const selectedColumnIds = props.displaySetting.relatedCellsDisplaySettings.map(relatedCellsDisplaySetting => {
      return relatedCellsDisplaySetting.columnId;
    });

    return selectedColumnIds.includes(column.id);
  });

  return (
    <div className={`${props.className}`}>

      {/* 対象セル */}
      <div className="mb-3">
        <Tag colorScheme="cyan">対象セル</Tag>
      </div>
      <div className={`mb-9 ${props.targetCell.type === CellDataType.Text ? "ml-4" : ""}`}>
        <CellViewer
          className="mb-2"
          cell={props.targetCell}
          onSoundCellToggle={props.onSoundCellToggle}
          onSoundCellPlay={props.onSoundCellPlay}
          onSoundCellPause={props.onSoundCellPause}
          onVideoCellToggle={props.onVideoCellToggle}
        />
      </div>

      {/* 関連セル */}
      <div className="mb-3">
        <Tag colorScheme="cyan">関連セル</Tag>
      </div>
      <div className="">
        {subColumns.map(subColumn => {
          // TODO メモ化とかも考えたけどpropsが多すぎて再レンダリング必要かどうかの比較するのも計算コストかかりそうだったので一旦略してる
          // 中央ペインでonmouseしているセルIDと関連しているセルだけフィルタリング。これがそれなりにたぶんコスト高い
          const currentRelatedCells = subColumn.cells.children
            .filter(cell =>
              relatedCells.isRelated(props.columnSpace.id,
                { columnId: subColumn.id, cellId: cell.id },
                { columnId: props.displaySetting.mainColumn, cellId: props.targetCell.id }
              )
            );

          const currentColumnDisplaySetting = props.displaySetting.relatedCellsDisplaySettings.find(displaySetting => displaySetting.columnId === subColumn.id)

          return (
            <div key={subColumn.id} className="mb-4">

              {/* カラム名 */}
              <div className="font-bold flex items-center">
                <span>{cellDataTypeIcons(subColumn.type, "w-3 h-3 mr-2")}</span>
                <span className="font-sans text-blue-400 text-sm">{subColumn.name}</span>
              </div>

              {/* 関連セルが無い場合 */}
              {currentRelatedCells.length === 0 && (
                <div className="ml-8">
                  <div className="select-none">-</div>
                </div>
              )}

              {/* 関連セルがあり、Verticalの場合 */}
              {(currentRelatedCells.length !== 0 && currentColumnDisplaySetting.direction === RelatedCellDisplayDirectionType.Vertical) && (
                <div className="ml-8 mt-1">
                  {currentRelatedCells.map(cell => {
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
              {(currentRelatedCells.length !== 0 && currentColumnDisplaySetting.direction === RelatedCellDisplayDirectionType.Horizontal) && (
                <div className="ml-8 mt-1">
                  {currentRelatedCells.map((cell, index) => {
                    return (
                      <React.Fragment key={cell.id}>
                        <CellViewerHorizontal
                          tooltipId={index + "-" + subColumn.id + "-"+ cell.id}   //TODO ここもう少しどうにかする　本当はindexの代わりに表示設定IDとかほしいところ　いずれキャッシュ制御で生成するようにするなら表示設定IDも必要になるだろうし
                          displayType={currentColumnDisplaySetting.hListDisplayType}
                          key={cell.id}
                          className="mb-2"
                          cell={cell}
                          withBackgroundHoveredColor={true}
                        />
                        {index !== currentRelatedCells.length-1 &&
                          <span className="mx-1 select-none">{currentColumnDisplaySetting.hListSeparator}</span>
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

    </div>
  )
}