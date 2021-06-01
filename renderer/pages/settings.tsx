import React from 'react';
import { BaseLayout } from '../components/layouts/BaseLayout';
import { LeftMenuType } from '../resources/LeftMenuType';

const Settings: React.FC = () => {

  return (
    <BaseLayout
      leftMenuType={LeftMenuType.SETTINGS}
    >

      {/* メイン表示 */}
      <div className="min-w-300px w-full bg-gray-900 overflow-y-auto p-3">
          なんか設定の読み書きをしたい
      </div>

    </BaseLayout>
  )

}

export default Settings;
