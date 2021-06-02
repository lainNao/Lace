import React from 'react';
import { useHomeController } from '../controllers/home/useHomeController';
import { ColumnSpaceExplorer } from "../pages.partial/home/ColumnSpaceExplorer";
import { BaseLayout } from '../components/layouts/BaseLayout';
import { LeftMenuType } from '../resources/LeftMenuType';
import { ColumnSpaceDisplayer } from '../pages.partial/home/ColumnSpaceDisplayer';

// TODO ツリーの表示がもっさりしてるから別のライブラリに切り替えるか、または今のツリーのオプションを探す
// TODO カラムスペース追加時に一瞬ガクっとなる（高さが限界を超える場合）のをいつか直す
const Home: React.FC = () => {

  const controller = useHomeController();

  if (!controller.isLoading) {
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
        classeName="min-w-300px w-300px whitespace-pre overflow-y-auto p-3"
      />

      {/* メイン表示 */}
      <div className="min-w-300px w-2/3 bg-gray-900 overflow-y-auto p-3">
        <ColumnSpaceDisplayer
          className=""
        />
      </div>

      {/* セル関連情報 */}
      <div className=" min-w-300px w-1/2 overflow-y-auto p-3">
        セルの詳細の表示
      </div>
    </BaseLayout>

  )
}

export default Home;
