import { useRecoilState } from "recoil"
import { ColumnSpace } from "../../../models/ColumnSpaces"
import { DisplaySetting } from "../../../models/DisplaySettings"
import relatedCellsState from "../../../recoils/atoms/relatedCellsState"
import { CellDataType } from "../../../resources/CellDataType"
import { Tag } from "@chakra-ui/react"
import { CellViewer } from "../../../components/CellViewer"

type Props = {
  className: string;
  displaySetting: DisplaySetting;
  columnSpace: ColumnSpace;
  onMouseMainCell: (event, cellId) => void;
  onSoundCellToggle: (event) => void;
  onSoundCellPlay: (event) => void;
  onSoundCellPause: (event) => void;
  onVideoCellToggle: (event) => void;
}

export const MainPane = (props: Props) => {
  const [relatedCells, setRelatedCells] = useRecoilState(relatedCellsState);

  //TODO 無限スクロールにする（画像とかの問題で無理ならひとまずいい）
  //TODO 後でフィルタリングペインの情報もfilterに宛がうことになる
  //TODO 必要ならuseMemoで結果をメモ化すること。左のツリーも。できなければ不要。
  //TODO onmouseとかで右カラムへの伝達をする
  const generateMainPaneElementTree = (
    indentIndex: number,
    sortDescendants: {
      columnId: string,
      cellId: string,
    }[]
  ) => {
    const targetColumnId = props.displaySetting.sortColumns[indentIndex];

    // 最後の段まで来た場合（メインカラムのレンダリング。ここは今までのソートカラムとリレーションしてるものを探索しながらとなる）
    if (!targetColumnId) {
      const mainColumn = props.columnSpace.findDescendantColumn(props.displaySetting.mainColumn);
      return (
        <div className="ml-8">
          {mainColumn.cells.children
            // ソートの祖先達と関連づいているものだけフィルタリング
            .filter(cell =>
              sortDescendants.every(sortDescendant =>
                relatedCells.isRelated(props.columnSpace.id,
                  { columnId: sortDescendant.columnId, cellId: sortDescendant.cellId },
                  { columnId: mainColumn.id, cellId: cell.id })
              )
            )
            .map(cell => {
              return (
                <CellViewer
                  key={cell.id}
                  className="mb-2"
                  cell={cell}
                  withLiPrefix={true}
                  withBackgroundHoveredColor={true}
                  onMouseMainCell={props.onMouseMainCell}
                  onSoundCellToggle={props.onSoundCellToggle}
                  onSoundCellPlay={props.onSoundCellPlay}
                  onSoundCellPause={props.onSoundCellPause}
                  onVideoCellToggle={props.onVideoCellToggle}
                />
              )
            })
          }
        </div>
      )
    }

    // まだ最後の段でない場合（ソートカラムのレンダリング）
    const currentSortColumn = props.columnSpace.findDescendantColumn(targetColumnId);
    return (
      <div className={`${indentIndex ? "ml-6" : ""}`}>
        {currentSortColumn.mapCells(cell => {
          return (
            <div key={cell.id} className="mb-3">
              {/* 今の段の今のセル */}
              <div className="mb-3 font-bold">
                <CellViewer cell={cell}
                  onSoundCellToggle={props.onSoundCellToggle}
                  onSoundCellPlay={props.onSoundCellPlay}
                  onSoundCellPause={props.onSoundCellPause}
                  onVideoCellToggle={props.onVideoCellToggle}
                />
              </div>

              {/* 次の段 */}
              <div>
                {generateMainPaneElementTree(indentIndex+1, sortDescendants.concat([{
                  columnId: targetColumnId,
                  cellId: cell.id,
                }]))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const generateMainPaneUnrelatedElementTree = () => {

    const getAlreadyRenderedCellIds = (
      indentIndex: number,
      sortDescendants: { columnId: string, cellId: string}[]
    ): string[] => {
      const targetColumnId = props.displaySetting.sortColumns[indentIndex];

      if (targetColumnId) {
        // まだ最後の段でない場合
        const currentSortColumn = props.columnSpace.findDescendantColumn(targetColumnId);
        const result = currentSortColumn.cells.children.flatMap(cell => {
          return getAlreadyRenderedCellIds(indentIndex+1, sortDescendants.concat([{
            columnId: targetColumnId,
            cellId: cell.id,
          }]))
        })
        return result;
      } else {
        // 最後の段まで来た場合
        const mainColumn = props.columnSpace.findDescendantColumn(props.displaySetting.mainColumn);
        const result =  mainColumn.cells.children
          .filter(cell =>
            sortDescendants.every(sortDescendant =>
              relatedCells.isRelated(props.columnSpace.id,
                { columnId: sortDescendant.columnId, cellId: sortDescendant.cellId },
                { columnId: mainColumn.id, cellId: cell.id }
              )
            )
          )
          .map(cell => cell.id)
        return result;
      }
    }

    const alreadyRenderedCellIds = Array.from(new Set(getAlreadyRenderedCellIds(0, [])));

    const makeView = (currentIndent: number) => {
      if (currentIndent === props.displaySetting.sortColumns.length) {
        const mainColumn = props.columnSpace.findDescendantColumn(props.displaySetting.mainColumn);
        return (
          <div className="ml-2">
            {mainColumn.cells.children
              .filter(cell => !alreadyRenderedCellIds.includes(cell.id))
              .map(cell => {
                return (
                  <CellViewer
                    key={cell.id}
                    className="mb-2"
                    cell={cell}
                    withLiPrefix={true}
                    withBackgroundHoveredColor={true}
                    onMouseMainCell={props.onMouseMainCell}
                    onSoundCellToggle={props.onSoundCellToggle}
                    onSoundCellPlay={props.onSoundCellPlay}
                    onSoundCellPause={props.onSoundCellPause}
                    onVideoCellToggle={props.onVideoCellToggle}
                  />
                )
              })
            }
          </div>
        )
      }

      return (
        <div className="ml-6">
          {makeView(currentIndent+1)}
        </div>

      )
    }

    return (
      <div>
        {makeView(0)}
      </div>
    )
  };

  return (
    <div className={`${props.className}`}>
      {/* 指定ソートカラム達に関連づいているもの */}
      <div className="mb-3"><Tag colorScheme="cyan">分類済</Tag></div>
      {generateMainPaneElementTree(0, [])}

      {/* 関連づいてないもの */}
      <div className="mt-10 mb-3"><Tag colorScheme="cyan">未分類</Tag></div>
      {generateMainPaneUnrelatedElementTree()}
    </div>
  )
}
