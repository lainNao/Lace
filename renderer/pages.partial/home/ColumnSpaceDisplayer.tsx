import { useColumnSpaceDisplayerController } from "../../controllers/home/useColumnSpaceDisplayerController";

type Props = {
  className: string;
}

export const ColumnSpaceDisplayer = (props: Props) => {

  const controller = useColumnSpaceDisplayerController();

  return (
    <div className="text-sm">
      <div>選択中のカラムスペースID： {controller.selectedColumnSpaceId}</div>
      <div>選択中の表示設定ID：</div>
      <div>　</div>
      セレクトボックスかタブみたいなのをここらへんに表示し、それで選択した表示設定に従った表示を出す。
    </div>
  )
}