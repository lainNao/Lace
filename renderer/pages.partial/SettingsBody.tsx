import React from 'react';
import { SettingsPanel } from './settings/SettingsPanel';

const SettingsBody: React.FC = () => {

  return (
    <div className="min-w-300px w-full bg-gray-900 overflow-y-auto p-3">
      {/* メイン表示 */}
      <SettingsPanel />
    </div>
  )

}

export default SettingsBody;
