
import { Input, Textarea } from "@chakra-ui/react"
import React from 'react';
import { Cell } from "../../../../../models/ColumnSpaces";
import { ImageCellData, MarkdownCellData, SoundCellData, TextCellData, VideoCellData } from "../../../../../models/ColumnSpaces/CellData.implemented";
import { CellDataType } from "../../../../../resources/CellDataType";
import MarkdownPreview from '@uiw/react-markdown-preview';
import "@uiw/react-markdown-preview/dist/markdown.css";

type CellInfoProps = {
  cell: Cell,
  className?: string,
}

export const CellInfo = (props: CellInfoProps) => {
  let cellInfoElem = null;

  if (props.cell.type === CellDataType.Text) {
    const cellData = props.cell.data as TextCellData;
    cellInfoElem = (
      <div>
        {cellData.text}
      </div>
    )
  }
  else if (props.cell.type === CellDataType.Markdown) {
    const cellData = props.cell.data as MarkdownCellData;
    cellInfoElem = (
      <div>
        <div className="mt-1">
          <div>タイトル</div>
          <div>
            <Input isReadOnly defaultValue={cellData.title} />
          </div>
        </div>
        <div className="mt-3">
          <div>本文</div>
          <div>
            {/* TODO ここマークダウンのレンダリングをしたいところ */}
            <Textarea isReadOnly defaultValue={cellData.text} />
          </div>
        </div>
        <div className="mt-3">
          <div>本文プレビュー</div>
          <div className="rounded-lg p-3 mb-3 bg-gray-900">
            <MarkdownPreview source={cellData.text} />
          </div>
        </div>
      </div>
    )
  }
  else if (props.cell.type === CellDataType.Sound) {
    const cellData = props.cell.data as SoundCellData;
    cellInfoElem = (
      <div>
        <div className="font-mono text-sm">{cellData.alias}</div>
        <div className="mt-4">
          <audio src={cellData.path} controls className="outline-none h-7" loop/>
        </div>
      </div>
    )
  }
  else if (props.cell.type === CellDataType.Video) {
    const cellData = props.cell.data as VideoCellData;
    cellInfoElem = (
      <div>
        <div className="font-mono text-sm">{cellData.alias}</div>
        <div>
          <video src={cellData.path} controls className="outline-none" loop/>
        </div>
      </div>
    )
  }
  else if (props.cell.type === CellDataType.Image) {
    const cellData = props.cell.data as ImageCellData;
    //TODO クリックで拡大表示したいところ
    cellInfoElem = (
      <div>
        <div className="font-mono text-sm">{cellData.alias}</div>
        <div>
          <img src={cellData.path} className="outline-none"/>
        </div>
      </div>
    )
  }

  return (
    <div className={`${props.className} mx-4 my-1`}>
      {cellInfoElem}
    </div>
  )
}



