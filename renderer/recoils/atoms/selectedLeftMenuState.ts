import { atom } from 'recoil';
import { LeftMenus } from '../../resources/enums/app';

const selectedLeftMenuState = atom<LeftMenus>({
  key: "selectedLeftMenuState",
  default: LeftMenus.HOME,
});

export default selectedLeftMenuState;
