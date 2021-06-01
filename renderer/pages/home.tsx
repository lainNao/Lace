import React from 'react';
import { useHomeController } from '../controllers/home/useHomeController';
import { ColumnSpaceExplorer } from "../pages.partial/home/ColumnSpaceExplorer";
import { BaseLayout } from '../components/layouts/BaseLayout';
import { LeftMenuType } from '../resources/LeftMenuType';

// TODO ツリーの表示がもっさりしてるから別のライブラリに切り替えるか、または今のツリーのオプションを探す
// TODO カラムスペース追加時に一瞬ガクっとなる（高さが限界を超える場合）のをいつか直す
const Home: React.FC = () => {

  const controller = useHomeController();
  // const currentMainDisplayedColumnUUID = "C23456789-C234-C234-C234-C23456789123"  //仮のモック
  // const currentColumnSpaceUUID = "123456789-1234-1234-1234-123456789123"; //仮のモック（これ今は半無限の深さになったので、道筋のUUIDの配列にするのがいいかも）
  // const currentMainColumnDatas = columnSpaces[props.currentColumnSpaceId].columns[props.currentMainColumnId].datas;

  if (!controller.isInitializeFinished) {
    return (
      <div>読込中</div>
    )
  }

  return (
    <BaseLayout
      leftMenuType={LeftMenuType.HOME}
    >
      {/* エクスプローラ */}
      <ColumnSpaceExplorer
        classeName="min-w-300px w-300px bg-gray-800 whitespace-pre overflow-y-auto p-3"
      />

      {/* メイン表示 */}
      <div className="min-w-300px bg-gray-900 overflow-y-auto p-3">
        セレクトボックスかタブみたいなのをここらへんに表示し、それで選択した表示設定に従った表示を出す。（表示設定自体はカラムスペースの右クリメニューからできるようにする）<br/><br/>
        グローバルステートではselectedColumnSpaceIdState、specificColumnSpaceStateは使う<br/><br/>
        あとはColumnSpacesと表示状態集約とかも使う
        {/* {Object.keys(currentMainColumnDatas).map((dataUUID,index) => {
          const data = currentMainColumnDatas[dataUUID];
          return (
            <div key={`${data.name}-${index}`}>
              <div><img src={data.path} /></div>
              <div>{data.name}</div>
            </div>
          )
        })} */}
      </div>

      {/* セル関連情報 */}
      <div className=" min-w-300px w-2/3 overflow-y-auto p-3">
        セルの詳細の表示
      </div>
    </BaseLayout>

  )
}

export default Home;
