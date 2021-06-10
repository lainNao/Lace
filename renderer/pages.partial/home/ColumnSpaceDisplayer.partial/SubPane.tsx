import { Cell, ColumnSpace } from "../../../models/ColumnSpaces"
import { DisplaySetting } from "../../../models/DisplaySettings"
import { Tag } from "@chakra-ui/react"
import { CellDataType } from "../../../resources/CellDataType"
import { CellViewer } from "../../../components/CellViewer"
import React from "react"
import { SubColumns } from "./SubPane.partial/SubColumns"

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

  if (!props.targetCell) {
    //TODO ここもう少しどうにかする
    return (
      <div className={`${props.className}`}>
        中央ペインのセルをクリックしてください
      </div>
    )
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
      <SubColumns
        subColumns={subColumns}
        columnSpace={props.columnSpace}
        displaySetting={props.displaySetting}
        targetCell={props.targetCell}
        onSoundCellToggle={props.onSoundCellToggle}
        onSoundCellPlay={props.onSoundCellPlay}
        onSoundCellPause={props.onSoundCellPause}
        onVideoCellToggle={props.onVideoCellToggle}
      />

    </div>
  )
}
