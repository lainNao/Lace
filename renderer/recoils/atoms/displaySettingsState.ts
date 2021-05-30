import { atom } from 'recoil';
import { DisplaySettings } from '../../models/DisplaySettings';

const displaySettingsState = atom<DisplaySettings>({
  key: "displaySettingsState",
  default: null,
});

export default displaySettingsState;
