import React from 'react';
import { ColumnSpaceExplorer } from "../pages.partial/home/ColumnSpaceExplorer";
import { BaseLayout } from '../components/layouts/BaseLayout';
import { ColumnSpaceDisplayer } from '../pages.partial/home/ColumnSpaceDisplayer';

const HomeLayout: React.FC = () => {

  return (
    <BaseLayout>

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

export default HomeLayout;
