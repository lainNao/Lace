import React from 'react';
import { BaseLayout } from '../components/layouts/BaseLayout';
import { SettingsPanel } from '../pages.partial/settings/SettingsPanel';

const SettingsLayout: React.FC = () => {

  return (
    <BaseLayout>

      {/* メイン表示 */}
      <div className="min-w-300px w-full bg-gray-900 overflow-y-auto p-3">
        <SettingsPanel />
      </div>

    </BaseLayout>
  )

}

export default SettingsLayout;
