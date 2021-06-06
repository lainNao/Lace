import React from 'react';
import { ColumnSpaceExplorer } from "./home/ColumnSpaceExplorer";
import { ColumnSpaceDisplayer } from './home/ColumnSpaceDisplayer';

const HomeBody: React.FC = () => {

  return (
    <>
      {/* エクスプローラ */}
      <ColumnSpaceExplorer
        classeName="w-300px whitespace-pre overflow-y-auto p-3"
      />

      {/* メイン表示 */}
      <div className="min-w-300px w-2/3 bg-gray-900 overflow-y-auto p-3">
        <ColumnSpaceDisplayer
          className=""
        />
      </div>

      {/* セル関連情報 */}
      <div className=" min-w-300px w-1/2 bg-gray-900 overflow-y-auto p-3">
        関連セル表示
      </div>
    </>

  )
}

export default HomeBody;
