import React from 'react';
import { BaseLayout } from '../components/layouts/BaseLayout';
import { useSettingsController } from '../controllers/settings/useSettingsController';
import { SettingsPanel } from '../pages.partial/settings/SettingsPanel';
import { LeftMenuType } from '../resources/LeftMenuType';

const Settings: React.FC = () => {
  const controller = useSettingsController();

  if (!controller.hasInitialized) {
    return (
      <div>読込中</div>
    )
  }

  return (
    <BaseLayout
      leftMenuType={LeftMenuType.SETTINGS}
    >

      {/* メイン表示 */}
      <div className="min-w-300px w-full bg-gray-900 overflow-y-auto p-3">
        <SettingsPanel />
      </div>

    </BaseLayout>
  )

}

export default Settings;
