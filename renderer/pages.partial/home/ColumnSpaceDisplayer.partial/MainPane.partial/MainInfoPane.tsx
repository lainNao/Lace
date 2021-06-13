
import { Cell, Column, ColumnSpace } from "../../../../models/ColumnSpaces"
import { DisplaySetting } from "../../../../models/DisplaySettings"
import { Tag } from "@chakra-ui/react"
import { CellViewer } from "../../../../components/CellViewer"
import { MainPaneTreeData, MainPaneTreeMeta } from "../../../../transformers/mainPaneDataTransformer"
import React from "react"
import ReactLoading from "react-loading";
import relatedCellsState from "../../../../recoils/atoms/relatedCellsState"
import { useRecoilState } from "recoil"
import displayTargetColumnSpaceIdState from "../../../../recoils/atoms/displayTargetColumnSpaceIdState"
import { FilterPaneCheckedData } from "./FilterPane"
import InfiniteScroll from 'react-infinite-scroll-component';

type MainInfoPainProps = {
  className: string;
  displaySetting: DisplaySetting;
  columnSpace: ColumnSpace;
  targetCell: Cell;
  mainPaneTreeMetaData: MainPaneTreeMeta,
  filterPaneDataTransformerData: FilterPaneCheckedData,
  onClickMainCell: (event, cellId) => void;
  onSoundCellToggle: (event) => void;
  onSoundCellPlay: (event) => void;
  onSoundCellPause: (event) => void;
  onVideoCellToggle: (event) => void;
}

export const MainInfoPane = (props: MainInfoPainProps) => {
  const [relatedCells, setRelatedCells] = useRecoilState(relatedCellsState);
  const [displayTargetColumnSpaceId, setDisplayTargetColumnSpaceId] = useRecoilState(displayTargetColumnSpaceIdState)

  //TODO 無限スクロールにする（画像とかの問題で無理ならひとまずいい）
  const generateMainPaneTree = () => {

    const inner = (currentLayerColumn: Column, mainPaneTreeDatas: MainPaneTreeData[], currentLayerColor?: string) => {
      if (currentLayerColumn) {
        // columnがある場合はまだ階層の途中となるようなデータにしてるのでそうレンダリング

        return (
          <div>
            <InfiniteScroll dataLength={mainPaneTreeDatas.length} loader={<h4>Loading...</h4>} next={null} hasMore={false}>
              {mainPaneTreeDatas.map(layer => {
                return (
                  <React.Fragment key={layer.cell.id}>
                    <div className="mb-2">
                      <CellViewer cell={layer.cell}
                        className={`${currentLayerColor} font-bold`}
                        onSoundCellToggle={props.onSoundCellToggle}
                        onSoundCellPlay={props.onSoundCellPlay}
                        onSoundCellPause={props.onSoundCellPause}
                        onVideoCellToggle={props.onVideoCellToggle}
                      />
                    </div>
                    <div className="ml-6">
                      {inner(layer.nextColumn, layer.next, currentLayerColor === "text-blue-400" ? "text-pink-400" : "text-blue-400" )}
                    </div>
                  </React.Fragment>
                )
              })}
            </InfiniteScroll>
          </div>
        )

      } else {
        // columnが無い場合はmainColumnの描画となるようなデータにしてるのでそうレンダリング

        const isCheckedMoreThanOne = Object.keys(props.filterPaneDataTransformerData).some(columnId => {
          return props.filterPaneDataTransformerData[columnId].length > 0
        })

        return (
          <div>
            {mainPaneTreeDatas
              .filter(layer => {
                // 1つもチェックついてないなら全部パス
                if (!isCheckedMoreThanOne) {
                  return true;
                }

                // 1つ以上チェックついてるなら、それと関わりのあるセルのみに絞る
                return Object.keys(props.filterPaneDataTransformerData).some(columnId =>
                  props.filterPaneDataTransformerData[columnId].some(cellId =>
                    relatedCells.isRelated(displayTargetColumnSpaceId,
                      {columnId: props.displaySetting.mainColumn, cellId: layer.cell.id},
                      {columnId: columnId, cellId: cellId }
                    )
                  )
                )
              })
              .map(layer => {
                //TODO 以下のml-3は本来不要なはず。「・」をつけるためにこねくりまわした影響なので後で直したい
                return (
                  <div className="ml-3 mb-2" key={layer.cell.id}>
                    <CellViewer
                      cell={layer.cell}
                      className="font-mono"
                      withLiPrefix={true}
                      withBackgroundHoveredColor={true}
                      pointer={true}
                      highLighted={(props.targetCell && props.targetCell.id === layer.cell.id)}
                      onClickMainCell={props.onClickMainCell}
                      onSoundCellToggle={props.onSoundCellToggle}
                      onSoundCellPlay={props.onSoundCellPlay}
                      onSoundCellPause={props.onSoundCellPause}
                      onVideoCellToggle={props.onVideoCellToggle}
                    />
                  </div>
                )
              })
            }
          </div>
        )
      }

    }

    // 最初のレイヤー
    return (
      <div>
        <InfiniteScroll dataLength={props.mainPaneTreeMetaData.classified.datas.length} loader={<h4>Loading...</h4>} next={null} hasMore={false}>
          {props.mainPaneTreeMetaData.classified.datas.map(topLayer => {
            return (
              <div key={topLayer.cell.id}>
                <div>
                  <CellViewer
                    key={topLayer.cell.id}
                    className="mb-2 font-bold text-pink-400"
                    cell={topLayer.cell}
                    onSoundCellToggle={props.onSoundCellToggle}
                    onSoundCellPlay={props.onSoundCellPlay}
                    onSoundCellPause={props.onSoundCellPause}
                    onVideoCellToggle={props.onVideoCellToggle}
                  />
                </div>
                <div className="ml-6">
                  {inner(topLayer.nextColumn, topLayer.next, "text-blue-400")}
                </div>
              </div>
            )
          })}
        </InfiniteScroll>
      </div>
    )
  }

  // 読込中の時
  if (!props.mainPaneTreeMetaData) {
    return (
      <div className={`${props.className}`}>
        <ReactLoading type="bubbles" />
      </div>
    )
  }

  const isCheckedMoreThanOne = Object.keys(props.filterPaneDataTransformerData).some(columnId => {
    return props.filterPaneDataTransformerData[columnId].length > 0
  })

  return (
    <div className={`${props.className}`}>
      {/* 指定ソートカラム達に関連づいているもの */}
      {generateMainPaneTree()}

      {/* 関連づいてないもの */}
      {props.mainPaneTreeMetaData.unclassified.datas.length !== 0 && (
        <React.Fragment key={props.displaySetting.id}>
          <div className="mt-10 mb-3"><Tag colorScheme="cyan">未分類</Tag></div>
          <div className="ml-2">
            {props.mainPaneTreeMetaData.unclassified.datas
              .filter(cell => {
                // 1つもチェックついてないなら全部パス
                if (!isCheckedMoreThanOne) {
                  return true;
                }

                // 1つ以上チェックついてるなら、それと関わりのあるセルのみに絞る
                return Object.keys(props.filterPaneDataTransformerData).some(columnId =>
                  props.filterPaneDataTransformerData[columnId].some(cellId =>
                    relatedCells.isRelated(displayTargetColumnSpaceId,
                      {columnId: props.displaySetting.mainColumn, cellId: cell.id},
                      {columnId: columnId, cellId: cellId }
                    )
                  )
                )
              })
              .map(cell => {
                return (
                  <div className="mb-2" key={cell.id}>
                    <CellViewer
                      cell={cell}
                      className="font-mono"
                      withLiPrefix={true}
                      withBackgroundHoveredColor={true}
                      pointer={true}
                      highLighted={(props.targetCell && props.targetCell.id === cell.id)}
                      onClickMainCell={props.onClickMainCell}
                      onSoundCellToggle={props.onSoundCellToggle}
                      onSoundCellPlay={props.onSoundCellPlay}
                      onSoundCellPause={props.onSoundCellPause}
                      onVideoCellToggle={props.onVideoCellToggle}
                    />
                  </div>
                )
              })
            }
          </div>
        </React.Fragment>
      )}

    </div>
  )

}