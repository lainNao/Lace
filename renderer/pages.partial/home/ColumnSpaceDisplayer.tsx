import { useColumnSpaceDisplayerController } from "../../controllers/home/useColumnSpaceDisplayerController";

type Props = {
  className: string;
}

export const ColumnSpaceDisplayer = (props: Props) => {

  const controller = useColumnSpaceDisplayerController();

  if (!controller.hasInitialized) {
    //TODO ここどうにかする
    return (
      <div>読込中</div>
    )
  }

  return (
    <div className="text-sm">
      <div>表示対象として選択中のカラムスペースID： {controller.selectedColumnSpaceId}</div>
      <div>選択中の表示設定ID：</div>
      <div>　</div>
      セレクトボックスかタブみたいなのをここらへんに表示し、それで選択した表示設定に従った表示を出す。
    </div>
  )
}