import { atom } from 'recoil';

const draggingNodeDatasetState = atom({
  key: "draggingNodeDataset",
  default: null,
  dangerouslyAllowMutability: true,
});

export default draggingNodeDatasetState;
