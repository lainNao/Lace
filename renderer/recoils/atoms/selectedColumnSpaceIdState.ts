import { atom } from 'recoil';

// TODO localStorageとかに保存してウィンドウをサイド開いた時に再生するようにしたい
const selectedColumnSpaceIdState = atom<string>({
  key: "selectedColumnSpaceIdState",
  default: null,
});

export default selectedColumnSpaceIdState;
