import { DisplaySetting } from "../../../models/DisplaySettings"

type Props = {
  className: string;
  displaySetting: DisplaySetting;
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
    </div>
  )
}