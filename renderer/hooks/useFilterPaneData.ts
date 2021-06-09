import { useEffect, useState } from "react";
import { Cell, ColumnSpace } from "../models/ColumnSpaces";
import { DisplaySetting } from "../models/DisplaySettings";

type Props = {
  columnSpace: ColumnSpace;
  displaySetting: DisplaySetting;
}

export const useFilterPaneData = (props: Props) => {
  const [filterPaneData, setFilterPaneData] = useState(null);

  const subColumns = props.columnSpace.columns.children.filter(column => {
    const selectedColumnIds = props.displaySetting.relatedCellsDisplaySettings.map(relatedCellsDisplaySetting => {
      return relatedCellsDisplaySetting.columnId;
    });
    return selectedColumnIds.includes(column.id);
  });

  // // 表示設定で選択されたカラムを取得
  // useEffect(() => {(async() => {
  //   const getSubColumnsData = () => new Promise(async(resolve, reject) => {

  //     //TODO ここやる　以下コメントにあるクエリーサービス呼んで、それをパースしてセルID達を取得し、　　次にsubColumnsを回してその中のセルと関連づいたものだけfilterかける感じ（こっちもクエリーサービスにしてもいいかも）


  //     // resolve(targetDatas);
  //   });

  //   setFilterPaneData(null);


  //   // 一旦初期化
  //   const result = await getSubColumnsData();
  //   // 読み込み結果を反映
  //   setFilterPaneData(result);
  // })()}, [props.displaySetting.id])


  /*
    メインペインのデータ、以下のような形でクエリーサービスに託そう。
      クエリーサービスというか、トランスフォーマーか…？
    クエリーサービスにはawaitで以下の構造のデータを返してもらう

    でそれをメインペインでも使おう。そうすれば無限スクロールもできる。パースの仕方はまた考える必要あるけど。
    フィルターペインでは、メインセルだけこの結果から自前で抽出して、それを使う（使い方は、セル達を回して、後はサブペインでやってるようなことをする感じ。セルIDから求められるから）
  */

  /* 過去メモ
    関連セルで使ってるカラム達とその中のセルを回して、チェックボックスで表示（デフォは無チェック）<br/>
    チェックされたら表示しないように中央ペインでフィルタリングする<br/>
    <br/><br/>
    まずforで回して全部セル表示する（できれば無限スクロールだけどたぶんできない）。<br/>
    で次にチェックボックスを頭につける<br/>
    で次にそのチェックボックスのonChangeと、用意していたイベントハンドラを紐付ける<br/>
    ちゃんとしたデータがそのイベントハンドラに送られるようになったら、その送られたデータをuseStateでちゃんと管理されてるか確認（オブジェクトか配列になるだろうので、変更判定が面倒かも。++するcntフィールド用意したほうが良いかも）<br/>
    でそのuseStateで管理された状態を中央ペインに流し、必要な場所にfilter()を追加してフィルタリングさせるようにする。!includesが満たされるもののみ表示かな。<br/>
    さらにCPUパワーが必要になりうるな…、、、、、、。
  */

  return [filterPaneData, subColumns] as const;
}