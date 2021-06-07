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

      {/* データ表示 */}
      <ColumnSpaceDisplayer
        className="bg-gray-900 px-3 pt-1 w-full h-full"
      />

    </>

  )
}

export default HomeBody;
