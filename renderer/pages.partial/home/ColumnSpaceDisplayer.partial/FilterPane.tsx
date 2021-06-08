import { ColumnSpace } from "../../../models/ColumnSpaces"
import { DisplaySetting } from "../../../models/DisplaySettings"

type Props = {
  className: string;
  displaySetting: DisplaySetting;
  columnSpace: ColumnSpace;
  onFilterUpdate: (checkedCellIds: {
    [columnId: string] : string[]
  }) => void;
}

export const FilterPane = (props: Props) => {
  return (
    <div className={`${props.className}`}>
      <div>{props.displaySetting.name}</div>
      <div>{props.displaySetting.mainColumn}</div>
      filter

      <br/><br/>
      関連セルで使ってるカラム達とその中のセルを回して、チェックボックスで表示（デフォは無チェック）<br/>
      チェックされたら表示しないように中央ペインでフィルタリングする<br/>
      <br/><br/>
      まずforで回して全部セル表示する（できれば無限スクロールだけどたぶんできない）。<br/>
      で次にチェックボックスを頭につける<br/>
      で次にそのチェックボックスのonChangeと、用意していたイベントハンドラを紐付ける<br/>
      ちゃんとしたデータがそのイベントハンドラに送られるようになったら、その送られたデータをuseStateでちゃんと管理されてるか確認（オブジェクトか配列になるだろうので、変更判定が面倒かも。++するcntフィールド用意したほうが良いかも）<br/>
      でそのuseStateで管理された状態を中央ペインに流し、必要な場所にfilter()を追加してフィルタリングさせるようにする。!includesが満たされるもののみ表示かな。<br/>
      さらにCPUパワーが必要になりうるな…、、、、、、。


    </div>
  )
}