import { DisplaySetting } from "../../../models/DisplaySettings"

type Props = {
  className: string;
  displaySetting: DisplaySetting;
  targetCellId: string;
}

export const SubPane = (props: Props) => {
  return (
    <div className={`${props.className}`}>
      <div>{props.displaySetting.name}</div>
      <div>{props.displaySetting.mainColumn}</div>

      Sub
    </div>
  )
}