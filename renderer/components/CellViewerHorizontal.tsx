import { CellDataType } from "../resources/CellDataType"
import { Cell } from "../models/ColumnSpaces"
import { ImageCellData, MarkdownCellData, SoundCellData, TextCellData, VideoCellData } from "../models/ColumnSpaces/CellData.implemented"
import MarkdownPreview from '@uiw/react-markdown-preview';
import "@uiw/react-markdown-preview/dist/markdown.css";
import { HListDisplayType } from "../models/DisplaySettings/RelatedCellsDisplaySetting";
import { Tag } from "@chakra-ui/react"
import ReactTooltip from "react-tooltip";

type CellViewerHorizontalProps = {
  tooltipId: string;
  cell: Cell;
  className?: string;
  withBackgroundHoveredColor?: boolean;
  displayType: HListDisplayType;
}


//TODO 画面からはみ出るのを固定値でmaxWidthとmaxHeightで防いでるからもう少しかっこよくしたいところ　たぶんマークダウンもはみ出る　あとそもそも半透明なの少し合わないのでそこも見たい
export const CellViewerHorizontal = ({
  tooltipId,
  cell,
  className,
  withBackgroundHoveredColor = false,
  displayType,
}: CellViewerHorizontalProps) => {

  if (cell.type === CellDataType.Text) {
    if (displayType === HListDisplayType.Plain) {
      return (
        <span className={`${className}  break-all whitespace-pre-wrap`}>
          {(cell.data as TextCellData).text}
        </span>
      )
    }

    if (displayType === HListDisplayType.Tag) {
      return (
        <Tag className={`${className} select-none break-all whitespace-pre-wrap`} size="sm" >
          {(cell.data as TextCellData).text}
        </Tag>
      )
    }
  }



  if (cell.type === CellDataType.Markdown) {
    if (displayType === HListDisplayType.Plain) {
      return (
        <>
          <span className={`${className} ${withBackgroundHoveredColor && "hover:bg-gray-800"} cursor-pointer break-all whitespace-pre-wrap`} data-tip="dummy" data-for={tooltipId} data-event='click' >
            {(cell.data as MarkdownCellData).title}
          </span>
          <ReactTooltip id={tooltipId} place='left' effect='solid' clickable={true} backgroundColor="transparent" className="opaque">
            <MarkdownPreview className="bg-gray-700 rounded-lg p-3 pt-2" source={(cell.data as MarkdownCellData).text} />
          </ReactTooltip>
        </>
      )
    }

    if (displayType === HListDisplayType.Tag) {
      return (
        <>
          <Tag className={`${className} ${withBackgroundHoveredColor && "hover:bg-gray-800"} cursor-pointer break-all whitespace-pre-wrap`} size="sm" variant="solid"  data-tip="dummy" data-for={tooltipId} data-event='click'>
            {(cell.data as MarkdownCellData).title}
          </Tag>
          <ReactTooltip id={tooltipId} place='left' effect='solid' clickable={true} backgroundColor="transparent" className="opaque">
            <MarkdownPreview className="bg-gray-700 rounded-lg p-3 pt-2" source={(cell.data as MarkdownCellData).text} />
          </ReactTooltip>
        </>
      )
    }

  }



  if (cell.type === CellDataType.Sound) {

    if (displayType === HListDisplayType.Plain) {
      return (
        <>
          <span className={`${className} ${withBackgroundHoveredColor && "hover:bg-gray-800"} cursor-pointer break-all whitespace-pre-wrap`} data-tip="dummy" data-for={tooltipId} data-event='click' >
            {(cell.data as SoundCellData).alias}
          </span>
          <ReactTooltip id={tooltipId} place='top' effect='solid' clickable={true} backgroundColor="transparent" className="opaque">
            <audio src={(cell.data as SoundCellData).path} controls className="outline-none h-7 max-w-full" />
          </ReactTooltip>
        </>
      )
    }

    if (displayType === HListDisplayType.Tag) {
      return (
        <>
          <Tag className={`${className} ${withBackgroundHoveredColor && "hover:bg-gray-800"} cursor-pointer break-all whitespace-pre-wrap`} size="sm" variant="solid"  data-tip="dummy" data-for={tooltipId} data-event='click'>
            {(cell.data as SoundCellData).alias}
          </Tag>
          <ReactTooltip id={tooltipId} place='top' effect='solid' clickable={true} backgroundColor="transparent" className="opaque">
            <audio src={(cell.data as SoundCellData).path} controls className="outline-none h-7 max-w-full" />
          </ReactTooltip>
        </>
      )
    }
  }



  if (cell.type === CellDataType.Image) {

    if (displayType === HListDisplayType.Plain) {
      return (
        <>
          <span className={`${className} ${withBackgroundHoveredColor && "hover:bg-gray-800"} cursor-pointer break-all whitespace-pre-wrap`} data-tip="dummy" data-for={tooltipId} data-event='click' >
            {(cell.data as ImageCellData).alias}
          </span>
          <ReactTooltip id={tooltipId} place='left' effect='solid' clickable={true} backgroundColor="transparent" className="opaque">
            <img src={(cell.data as ImageCellData).path}  className="outline-none max-w-full" style={{maxHeight: "500px", maxWidth: "500px"}}/>
          </ReactTooltip>
        </>
      )
    }

    if (displayType === HListDisplayType.Tag) {
      return (
        <>
          <Tag className={`${className} ${withBackgroundHoveredColor && "hover:bg-gray-800"} cursor-pointer break-all whitespace-pre-wrap`} size="sm" variant="solid"  data-tip="dummy" data-for={tooltipId} data-event='click'>
            {(cell.data as ImageCellData).alias}
          </Tag>
          <ReactTooltip id={tooltipId} place='left' effect='solid' clickable={true} backgroundColor="transparent" className="opaque">
            <img src={(cell.data as ImageCellData).path}  className="outline-none max-w-full" style={{maxHeight: "500px", maxWidth: "500px"}} />
          </ReactTooltip>
        </>
      )
    }
  }


  if (cell.type === CellDataType.Video) {
    if (displayType === HListDisplayType.Plain) {
      return (
        <>
          <span className={`${className} ${withBackgroundHoveredColor && "hover:bg-gray-800"} cursor-pointer break-all whitespace-pre-wrap`} data-tip="dummy" data-for={tooltipId} data-event='click' >
            {(cell.data as VideoCellData).alias}
          </span>
          <ReactTooltip id={tooltipId} place='left' effect='solid' clickable={true} backgroundColor="transparent" className="opaque">
            <video src={(cell.data as VideoCellData).path} controls className="outline-none max-w-full" style={{maxHeight: "500px", maxWidth: "500px"}} />
          </ReactTooltip>
        </>
      )
    }

    if (displayType === HListDisplayType.Tag) {
      return (
        <>
          <Tag className={`${className} ${withBackgroundHoveredColor && "hover:bg-gray-800"} cursor-pointer break-all whitespace-pre-wrap`} size="sm" variant="solid"  data-tip="dummy" data-for={tooltipId} data-event='click'>
            {(cell.data as VideoCellData).alias}
          </Tag>
          <ReactTooltip id={tooltipId} place='left' effect='solid' clickable={true} backgroundColor="transparent" className="opaque">
            <video src={(cell.data as VideoCellData).path} controls className="outline-none max-w-full" style={{maxHeight: "500px", maxWidth: "500px"}}/>
          </ReactTooltip>
        </>
      )
    }

  }

}