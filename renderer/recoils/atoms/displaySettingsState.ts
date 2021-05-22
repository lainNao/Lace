import { atom } from 'recoil';
import { DisplaySettings } from '../../models/DisplaySettings';

const displaySettingsState = atom<DisplaySettings>({
  key: "RelatedCells",
  default: null,
});

export default displaySettingsState;
