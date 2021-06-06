import { DisplaySetting } from "../../../models/DisplaySettings"

type Props = {
  className: string;
  displaySetting: DisplaySetting;
  onMouseMainCell: (event, cellId) => void;
}

export const MainPane = (props: Props) => {
  return (
    <div className={`${props.className}`}>
      <div>{props.displaySetting.name}</div>
      <div>{props.displaySetting.mainColumn}</div>
      main
    </div>
  )
}