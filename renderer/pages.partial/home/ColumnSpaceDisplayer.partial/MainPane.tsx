import { useMemo } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { Cell, ColumnSpace } from "../../../models/ColumnSpaces"
import { ImageCellData, MarkdownCellData, SoundCellData, TextCellData, VideoCellData } from "../../../models/ColumnSpaces/CellData.implemented"
import { DisplaySetting } from "../../../models/DisplaySettings"
import relatedCellsState from "../../../recoils/atoms/relatedCellsState"
import { CellDataType } from "../../../resources/CellDataType"
import { Tag, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import MarkdownPreview from '@uiw/react-markdown-preview';
import "@uiw/react-markdown-preview/dist/markdown.css";

type Props = {
  className: string;
  displaySetting: DisplaySetting;
  columnSpace: ColumnSpace;
  onMouseMainCell: (event, cellId) => void;
  onToggleSoundCell: (event) => void;
  onSoundCellPlay: (event) => void;
  onSoundCellPause: (event) => void;
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
        <div className="ml-6">
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
                <SortColumnCell
                  key={cell.id}
                  className="mb-2"
                  cell={cell}
                  withLiPrefix={cell.type === CellDataType.Text}
                  onMouseMainCell={props.onMouseMainCell}
                  onToggleSoundCell={props.onToggleSoundCell}
                  onSoundCellPlay={props.onSoundCellPlay}
                  onSoundCellPause={props.onSoundCellPause}
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
      <div className={`${indentIndex ? "ml-5" : ""}`}>
        {currentSortColumn.mapCells(cell => {
          return (
            <div key={cell.id} className="mb-3">
              {/* 今の段の今のセル */}
              <div className="mb-3 font-bold">
                <SortColumnCell cell={cell}
                  onToggleSoundCell={props.onToggleSoundCell}
                  onSoundCellPlay={props.onSoundCellPlay}
                  onSoundCellPause={props.onSoundCellPause}
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
                { columnId: mainColumn.id, cellId: cell.id })
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
          <div className="ml-1">
            {mainColumn.cells.children
              .filter(cell => !alreadyRenderedCellIds.includes(cell.id))
              .map(cell => {
                return (
                  <SortColumnCell
                    key={cell.id}
                    className="mb-2"
                    cell={cell}
                    withLiPrefix={cell.type === CellDataType.Text}
                    onMouseMainCell={props.onMouseMainCell}
                    onToggleSoundCell={props.onToggleSoundCell}
                    onSoundCellPlay={props.onSoundCellPlay}
                    onSoundCellPause={props.onSoundCellPause}
                  />
                )
              })
            }
          </div>
        )
      }

      return (
        <div className="ml-5">
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

type SortColumnCellProps = {
  cell: Cell;
  className?: string;
  withLiPrefix?: boolean;
  onMouseMainCell?: (event, cellId) => void;
  onToggleSoundCell?: (event) => void;
  onSoundCellPlay?: (event) => void;
  onSoundCellPause?: (event) => void;
}

//TODO マシにする
const SortColumnCell = ({
  cell,
  className,
  withLiPrefix = false,
  onMouseMainCell = () => {},
  onToggleSoundCell = () => {},
  onSoundCellPlay = () => {},
  onSoundCellPause = () => {},
}: SortColumnCellProps) => {
  if (cell.type === CellDataType.Text) {
    return <div onMouseEnter={(e) => onMouseMainCell(e,cell.id)} className={`${className} ${withLiPrefix ? "custom-li-prefix" : ""} `}>{(cell.data as TextCellData).text}</div>
  }
  if (cell.type === CellDataType.Markdown) {
    return (
      <div onMouseEnter={(e) => onMouseMainCell(e,cell.id)} className={`${className} ${withLiPrefix ? "custom-li-prefix" : ""} `}>
        <details>
          <summary className="outline-none cursor-pointer">{(cell.data as MarkdownCellData).title}</summary>
          <div className="bg-gray-800 ml-2 mr-3 my-1 pb-3 pt-1 px-3 rounded-lg">
            <MarkdownPreview source={(cell.data as MarkdownCellData).text} />
          </div>
        </details>
      </div>
    )
  }
  if (cell.type === CellDataType.Sound) {
    //TODO 開閉で音の再生非再生もしちゃいたい　detailsタグにonToggleイベントがあるっぽいからそこでなど　※他のを再生してたらそっち止めたいのでそこらへんも制御時に考慮したいところ
    return (
      <div onMouseEnter={(e) => onMouseMainCell(e,cell.id)} className={`${className} ${withLiPrefix ? "custom-li-prefix" : ""} `}>
        <details onToggle={onToggleSoundCell} data-is-opening={false}>
          <summary className="outline-none cursor-pointer">{(cell.data as SoundCellData).alias}</summary>
          <div className="mt-3 mb-4 ml-2">
            <audio src={(cell.data as SoundCellData).path} controls className="outline-none h-7" onPlay={onSoundCellPlay} onPause={onSoundCellPause} data-cell-id={cell.id} />
          </div>
        </details>
      </div>
    )
  }
  if (cell.type === CellDataType.Image) {
    return <div onMouseEnter={(e) => onMouseMainCell(e,cell.id)} className={`${className} ${withLiPrefix ? "custom-li-prefix" : ""} `}>Image {(cell.data as ImageCellData).alias}</div>
  }
  if (cell.type === CellDataType.Video) {
    return <div onMouseEnter={(e) => onMouseMainCell(e,cell.id)} className={`${className} ${withLiPrefix ? "custom-li-prefix" : ""} `}>Video {(cell.data as VideoCellData).alias}</div>
  }

}