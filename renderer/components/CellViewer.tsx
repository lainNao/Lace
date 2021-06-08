import { CellDataType } from "../resources/CellDataType"
import { Cell } from "../models/ColumnSpaces"
import { ImageCellData, MarkdownCellData, SoundCellData, TextCellData, VideoCellData } from "../models/ColumnSpaces/CellData.implemented"
import MarkdownPreview from '@uiw/react-markdown-preview';
import "@uiw/react-markdown-preview/dist/markdown.css";

type CellViewerProps = {
  cell: Cell;
  className?: string;
  withLiPrefix?: boolean;
  withBackgroundHoveredColor?: boolean;
  pointer?: boolean;
  highLighted?: boolean;
  onClickMainCell?: (event, cellId) => void;
  onSoundCellToggle?: (event) => void;
  onSoundCellPlay?: (event) => void;
  onSoundCellPause?: (event) => void;
  onVideoCellToggle?: (event) => void;
}

export const CellViewer = ({
  cell,
  className,
  withLiPrefix = false,
  withBackgroundHoveredColor = false,
  pointer = false,
  highLighted = false,
  onClickMainCell = () => {},
  onSoundCellToggle = () => {},
  onSoundCellPlay = () => {},
  onSoundCellPause = () => {},
  onVideoCellToggle = () => {},
}: CellViewerProps) => {
  if (cell.type === CellDataType.Text) {
    return (
      <div>
        <span
          onMouseDown={(e) => onClickMainCell(e, cell)}
          className={`${className} ${withLiPrefix ? "custom-li-prefix" : ""} ${pointer && "cursor-pointer"} ${(withBackgroundHoveredColor && !highLighted) && "hover:bg-gray-800"} ${highLighted && "bg-gray-700"} rounded`}
        >
          {(cell.data as TextCellData).text}
        </span>
      </div>
    )
  }
  if (cell.type === CellDataType.Markdown) {
    return (
      <div className={`${className} ${withLiPrefix ? "custom-li-prefix flex" : ""} `}>
        <details onMouseDown={(e) => onClickMainCell(e, cell)}  className={`${(withBackgroundHoveredColor && !highLighted) && "hover:bg-gray-800"} ${withLiPrefix ? "ml-1" : "" }  ${highLighted && "bg-gray-700"}  rounded-b-lg rounded-tr-lg rounded`}>
          <summary className="outline-none cursor-pointer">{(cell.data as MarkdownCellData).title}</summary>
          <div className="pb-3 pt-1 px-3 rounded-lg">
            <MarkdownPreview className="bg-gray-700 rounded-lg p-3 pt-2" source={(cell.data as MarkdownCellData).text} />
          </div>
        </details>
      </div>
    )
  }
  if (cell.type === CellDataType.Sound) {
    return (
      <div  className={`${className} ${withLiPrefix ? "custom-li-prefix flex" : ""} `}>
        <details onMouseDown={(e) => onClickMainCell(e, cell)}  className={`${(withBackgroundHoveredColor && !highLighted) && "hover:bg-gray-800"} ${withLiPrefix ? "ml-1" : "" }  ${highLighted && "bg-gray-700"}  rounded-b-lg rounded-tr-lg rounded`} onToggle={onSoundCellToggle} data-is-opening={false}>
          <summary className="outline-none cursor-pointer">{(cell.data as SoundCellData).alias}</summary>
          <div className="mt-3 mb-2 ml-2 pb-2">
            <audio src={(cell.data as SoundCellData).path} controls className="outline-none h-7 max-w-full" onPlay={onSoundCellPlay} onPause={onSoundCellPause} data-cell-id={cell.id} />
          </div>
        </details>
      </div>
    )
  }
  if (cell.type === CellDataType.Image) {
    return (
      <div  className={`${className} ${withLiPrefix ? "custom-li-prefix flex" : ""} `}>
        <details onMouseDown={(e) => onClickMainCell(e, cell)}  className={`${(withBackgroundHoveredColor && !highLighted) && "hover:bg-gray-800"} ${withLiPrefix ? "ml-1" : "" }  ${highLighted && "bg-gray-700"}  rounded-b-lg rounded-tr-lg rounded`} data-is-opening={false}>
          <summary className="outline-none cursor-pointer">{(cell.data as ImageCellData).alias}</summary>
          <div className="mt-3 mb-2 mx-3 pb-2">
            <img loading="lazy" src={(cell.data as ImageCellData).path} className="outline-none max-w-full" data-cell-id={cell.id} />
          </div>
        </details>
      </div>
    )
  }
  if (cell.type === CellDataType.Video) {
    return (
      <div  className={`${className} ${withLiPrefix ? "custom-li-prefix flex" : ""} `}>
        <details onMouseDown={(e) => onClickMainCell(e, cell)} className={`${(withBackgroundHoveredColor && !highLighted) && "hover:bg-gray-800"} ${withLiPrefix ? "ml-1" : "" }  ${highLighted && "bg-gray-700"}  rounded-b-lg rounded-tr-lg rounded`} onToggle={onVideoCellToggle} data-is-opening={false}>
          <summary className="outline-none cursor-pointer">{(cell.data as VideoCellData).alias}</summary>
          <div className="mt-3 mb-2 mx-3 pb-2">
            <video controls src={(cell.data as VideoCellData).path} className="outline-none max-w-full" data-cell-id={cell.id} />
          </div>
        </details>
      </div>
    )
  }

}