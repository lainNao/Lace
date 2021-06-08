import { atom } from 'recoil';

const displayTargetColumnSpaceIdState = atom<string>({
  key: "displayTargetColumnSpaceIdState",
  default: null,
});

export default displayTargetColumnSpaceIdState;
