import { Cell, Column, ColumnSpace } from "../models/ColumnSpaces";
import { DisplaySetting } from "../models/DisplaySettings"
import { RelatedCells } from "../models/RelatedCells";

// メインペインの表示のためのデータを作成する。データ構造は以下の型参照。
// 以下columnSpaceとdisplaySettingは「現在のカラムスペースのもの」なので引数に入れる前の段階で絞り込んでから入れること
export const mainPaneDataTransformer = (
  columnSpace: ColumnSpace,
  displaySettings: DisplaySetting[],
  relatedCells: RelatedCells,
): Promise<MainPaneDataTransformerData> => {

  return new Promise((resolve, reject) => {
    try {
      const result = displaySettings
        .map(displaySetting => {
          const firstColumn = columnSpace.findDescendantColumn(displaySetting.sortColumns[0])
          const classifiedCellIds = [];

          // 仕組み：　次のインデントを引数に入れて、それが次の実行時に存在するかどうかを判別させることでいい感じに階層を走査する再帰をしてる
          const generateMainPaneTreeData = (
            indentIndex: number,
            sortDescendants: {
              column: Column,
              cell: Cell,
            }[]
          ): MainPaneTreeData[] => {
            const targetColumnId = displaySetting.sortColumns[indentIndex];
            if (targetColumnId) {
              // ソートカラムのあるインデックスをたどった場合、まだソートカラムがあるということなのでそのセルを走査してデータ作成
              const currentSortColumn = columnSpace.findDescendantColumn(targetColumnId);
              const nextIndentIndex = indentIndex + 1;
              const nextSortColumn = columnSpace.findDescendantColumn(displaySetting.sortColumns[nextIndentIndex]);

              return currentSortColumn.cells.children.map(cell => {
                return {
                  cell: cell,
                  nextColumn: nextSortColumn,
                  next: generateMainPaneTreeData(
                    nextIndentIndex,
                    sortDescendants.concat([{column: currentSortColumn,cell: cell,
                  }])),
                }
              })
            } else {
              // ソートカラムの無いインデックスをたどった場合、もう無いのでメインカラムと判断しもう再帰せず最後の層のデータを返す
              const mainColumn = columnSpace.findDescendantColumn(displaySetting.mainColumn);

              // ソートの祖先達と関連づいているものだけフィルタリング
              return mainColumn.cells.children
                .filter(cell =>
                  sortDescendants.every(sortDescendant =>
                    relatedCells.isRelated(columnSpace.id,
                      { columnId: sortDescendant.column.id, cellId: sortDescendant.cell.id },
                      { columnId: mainColumn.id, cellId: cell.id }
                    )
                  )
                ).map(cell => {
                  classifiedCellIds.push(cell.id);  //NOTE: ここで分類済のセルIDをメモっておくことで、unclassifiedフィールドは「これ以外」とすることができ計算コスト少し節約になる的な意図で入れてる
                  return {
                    cell: cell,
                  }
                })
            }
          }
          const mainPaneDatas = generateMainPaneTreeData(0, []);
          const mainColumn = columnSpace.findDescendantColumn(displaySetting.mainColumn);
          const uniqueClassifiedCellIds = Array.from(new Set(classifiedCellIds));

          return {
            [displaySetting.id]: {
              classified: {
                firstColumn: firstColumn,
                datas: mainPaneDatas,
              },
              unclassified: {
                column: mainColumn,
                datas: mainColumn.cells.children.filter(cell => !uniqueClassifiedCellIds.includes(cell.id))
              }
            },
          }
        })
        .reduce((result, current) => {
          const firstKey = Object.keys(current)[0]
          result[firstKey] = current[firstKey];
          return result;
        });

      resolve(result);
    } catch (error) {
      reject(error);
    }
  })
}

export type MainPaneDataTransformerData = {
  [displaySettingId: string]: MainPaneTreeMeta,
}

export type MainPaneTreeMeta = {
  "classified": { //分類されたもの
    "firstColumn": Column,  //1階層目のColumn
    "datas": MainPaneTreeData[],
  },
  "unclassified": { //未分類のもの
    "column": Column,   //メインのColumn
    "datas": Cell[],
  }
}

export type MainPaneTreeData = {
  "cell": Cell,
  "nextColumn"?: Column,      //次階層のColumn（これが無い場合最終階層とする）
  "next"?: MainPaneTreeData[] //次階層のデータ（これが無い場合最終階層とする）
}
