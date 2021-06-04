import { atom } from 'recoil';
import { GlobalSettings } from '../../models/GlobalSettings';

const globalSettingsState = atom<GlobalSettings>({
  key: "globalSettingsState",
  default: null,
});

export default globalSettingsState;
