import { Cell, ColumnSpace } from "../../../models/ColumnSpaces"
import { DisplaySetting } from "../../../models/DisplaySettings"
import { MainPaneTreeMeta } from "../../../transformers/mainPaneDataTransformer"
import React from "react"
import { FilterPane } from "./MainPane.partial/FilterPane";
import { MainInfoPane } from "./MainPane.partial/MainInfoPane"
import { useFilterPaneData } from "../../../hooks/useFilterPaneData";
import ReactLoading from "react-loading";

type Props = {
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

export const MainPane = (props: Props) => {

  const [filterPaneData, filterPaneDataTransformerData, onFilterUpdate] = useFilterPaneData({
    columnSpace: props.columnSpace,
    displaySetting: props.displaySetting,
    mainPaneTreeMetaData: props.mainPaneTreeMetaData,
  });

  return (
    <>
      {filterPaneData
        ? <FilterPane
            className="w-1/5 overflow-y-auto mr-2 h-full text-xs"
            filterPaneData={filterPaneData}
            onFilterUpdate={onFilterUpdate}
            onSoundCellToggle={props.onSoundCellToggle}
            onSoundCellPlay={props.onSoundCellPlay}
            onSoundCellPause={props.onSoundCellPause}
            onVideoCellToggle={props.onVideoCellToggle}
          />
        : <div className="w-1/5 overflow-y-auto mr-2 h-full text-xs">
            <ReactLoading type="bubbles" />
          </div>
      }

      <MainInfoPane
        className="w-2/5 overflow-y-auto mr-2 h-full pb-10 text-xs"
        displaySetting={props.displaySetting}
        columnSpace={props.columnSpace}
        targetCell={props.targetCell}
        mainPaneTreeMetaData={props.mainPaneTreeMetaData}
        filterPaneDataTransformerData={filterPaneDataTransformerData}
        onClickMainCell={props.onClickMainCell}
        onSoundCellToggle={props.onSoundCellToggle}
        onSoundCellPlay={props.onSoundCellPlay}
        onSoundCellPause={props.onSoundCellPause}
        onVideoCellToggle={props.onVideoCellToggle}

      />
    </>
  )
}
