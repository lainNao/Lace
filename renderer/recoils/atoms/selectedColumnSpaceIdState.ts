import { atom } from 'recoil';

const selectedColumnSpaceIdState = atom<string>({
  key: "selectedColumnSpaceIdState",
  default: null,
});

export default selectedColumnSpaceIdState;
