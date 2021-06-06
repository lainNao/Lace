import { ColumnSpace } from "../../../models/ColumnSpaces"
import { DisplaySetting } from "../../../models/DisplaySettings"

type Props = {
  className: string;
  columnSpace: ColumnSpace;
  displaySetting: DisplaySetting;
  targetCellId: string;
  onToggleSoundCell: (event) => void;
  onSoundCellPlay: (event) => void;
  onSoundCellPause: (event) => void;
}

export const SubPane = (props: Props) => {

  if (!props.targetCellId) {
    //TODO ここもう少しどうにかする
    return <div>中央ペインのセルにマウスを乗せてください</div>
  }

  return (
    <div className={`${props.className}`}>
      <div>表示設定名　{props.displaySetting.name}</div>
      <div>カラムスペースID　{props.columnSpace.id}</div>
      <div>カラムID　{props.displaySetting.mainColumn}</div>
      <div>セルID　{props.targetCellId}</div>
      Sub
    </div>
  )
}