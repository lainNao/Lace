import { atom } from 'recoil';
import { LeftMenus } from '../../resources/enums/app';

// TODO localStorageとかに保存してウィンドウをサイド開いた時に再生するようにしたい
const selectedLeftMenuState = atom<LeftMenus>({
  key: "selectedLeftMenuState",
  default: LeftMenus.HOME,
});

export default selectedLeftMenuState;
