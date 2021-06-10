import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { ColumnSpace } from "../models/ColumnSpaces";
import { DisplaySetting } from "../models/DisplaySettings";
import { FilterPaneCheckedData, FilterPaneData } from "../pages.partial/home/ColumnSpaceDisplayer.partial/MainPane.partial/FilterPane";
import displayTargetColumnSpaceIdState from "../recoils/atoms/displayTargetColumnSpaceIdState";
import relatedCellsState from "../recoils/atoms/relatedCellsState";
import { MainPaneTreeMeta } from "../transformers/mainPaneDataTransformer";

type Props = {
  columnSpace: ColumnSpace;
  displaySetting: DisplaySetting;
  mainPaneTreeMetaData: MainPaneTreeMeta;
}


export const useFilterPaneData = (props: Props): [
  FilterPaneData,
  FilterPaneCheckedData,
  (checkedCellIds: FilterPaneCheckedData) => void,
] => {
  const [relatedCells, setRelatedCells] = useRecoilState(relatedCellsState);
  const [displayTargetColumnSpaceId, setDisplayTargetColumnSpaceId] = useRecoilState(displayTargetColumnSpaceIdState)
  const [filterPaneData, setFilterPaneData] = useState<FilterPaneData>(null);
  const [filterPaneDataTransformerData, setFilterPaneCheckedData] = useState<FilterPaneCheckedData>({});

  // メインペインのフィルタリングに使うためのデータ（filterPaneDataTransformerData）を作る（というか実質FilterPaneから送られてきたのをセットするだけ）
  // TODO ここの引数の型、Formikに合わせてかえるかも。わからんけど。生のformのonchangeイベントで十分扱いやすいならその内部でこの型に変換してこれ発火してもいいし。
  const onFilterUpdate = (checkedCellIds: FilterPaneCheckedData) => {
    console.debug("フィルター条件更新");
    setFilterPaneCheckedData(checkedCellIds)
  }

  // フィルターペイン表示のためのデータ（filterPaneData）を作る
  useEffect(() => {
    setFilterPaneData(null);

    if (!(props.mainPaneTreeMetaData && props.columnSpace && props.displaySetting && relatedCells && displayTargetColumnSpaceId)) {
      return;
    }

    (async() => {

      // subペインで使っているカラム達を抽出（この中のセルをフィルターペインで絞って表示するので取得しておく）
      const subColumns = props.columnSpace.columns.children.filter(column => {
        const selectedColumnIds = props.displaySetting.relatedCellsDisplaySettings.map(relatedCellsDisplaySetting => {
          return relatedCellsDisplaySetting.columnId;
        });
        return selectedColumnIds.includes(column.id);
      });

      // メインカラムのセルデータを全て配列で取得
      const mainColumn = props.columnSpace.findDescendantColumn(props.displaySetting.mainColumn);
      const mainColumnCells = mainColumn.cells.children;

      //サブカラムのセルを全部回し、メインカラムとセルのいずれかとリレーション貼ってるセルのみ抽出
      //TODO ここ、Cellsのドメイン知識流出してるっぽいかもだし、こういうfind系の再帰系は他にもこういう所あると思うのでまああとで…
      const filterPaneDataResult = subColumns.map(subColumn => {
        return {
          column: subColumn,
          cells: subColumn.cells.children.filter(subColumnCell => {
            return mainColumnCells.some(mainColumnCell =>
              relatedCells.isRelated(displayTargetColumnSpaceId,
                { columnId: subColumn.id, cellId: subColumnCell.id },
                { columnId: mainColumn.id, cellId: mainColumnCell.id }
              )
            );
          })
        }
      })

      setFilterPaneData(prev => filterPaneDataResult)
    })();
  }, [props.mainPaneTreeMetaData, relatedCells, displayTargetColumnSpaceId]);

  return [
    filterPaneData,
    filterPaneDataTransformerData,
    onFilterUpdate,
  ];
}

