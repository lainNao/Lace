import { useRecoilValue } from "recoil"
import { Cell, Column, ColumnSpace } from "../../../models/ColumnSpaces"
import { DisplaySetting } from "../../../models/DisplaySettings"
import relatedCellsState from "../../../recoils/atoms/relatedCellsState"
import { Tag } from "@chakra-ui/react"
import { CellViewer } from "../../../components/CellViewer"
import { MainPaneTreeData, MainPaneTreeMeta } from "../../../transformers/mainPaneDataTransformer"
import React from "react"
import ReactLoading from "react-loading";

type Props = {
  className: string;
  displaySetting: DisplaySetting;
  columnSpace: ColumnSpace;
  targetCell: Cell;
  mainPaneTreeMetaData: MainPaneTreeMeta,
  onClickMainCell: (event, cellId) => void;
  onSoundCellToggle: (event) => void;
  onSoundCellPlay: (event) => void;
  onSoundCellPause: (event) => void;
  onVideoCellToggle: (event) => void;
}

//TODO 読み込みを非同期化したい
export const MainPane = (props: Props) => {
  const relatedCells = useRecoilValue(relatedCellsState);

  //TODO 無限スクロールにする（画像とかの問題で無理ならひとまずいい）
  //TODO 後でフィルタリングペインの情報をfilterに宛がうことになる
  const generateMainPaneTree = () => {

    const inner = (currentLayerColumn: Column, mainPaneTreeDatas: MainPaneTreeData[], currentLayerColor?: string) => {
      if (currentLayerColumn) {
        // columnがある場合はまだ階層の途中となるようなデータにしてるのでそうレンダリング

        return (
          <div>
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
          </div>
        )

      } else {
        // columnが無い場合はmainColumnの描画となるようなデータにしてるのでそうレンダリング

        return (
          <div>
            {mainPaneTreeDatas.map(layer => {
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
            })}
          </div>
        )
      }

    }

    // 最初のレイヤー
    return (
      <div>
        {props.mainPaneTreeMetaData.classified.datas.map(topLayer => {
          return (
            <div>
              <div>
                <CellViewer
                  key={topLayer.cell.id}
                  className="mb-2 font-bold text-pink-400"
                  cell={topLayer.cell}
                  onClickMainCell={props.onClickMainCell}
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
      </div>
    )
  }

  // 読込中の時
  if (!props.mainPaneTreeMetaData) {
    return (
      <div className="">
        <ReactLoading type="bubbles" />
      </div>
    )
  }

  return (
    <div className={`${props.className}`}>
      {/* 指定ソートカラム達に関連づいているもの */}
      {generateMainPaneTree()}

      {/* 関連づいてないもの */}
      {props.mainPaneTreeMetaData.unclassified.datas.length !== 0 && (
        <>
          <div className="mt-10 mb-3"><Tag colorScheme="cyan">未分類</Tag></div>
          <div className="ml-2">
            {props.mainPaneTreeMetaData.unclassified.datas.map(cell => {
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
            })}
          </div>
        </>
      )}

    </div>
  )
}
