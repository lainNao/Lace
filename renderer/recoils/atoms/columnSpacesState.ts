import { atom } from 'recoil';
import { ColumnSpaces } from '../../models/ColumnSpaces';

const columnSpacesState = atom<ColumnSpaces>({
  key: "columnSpacesState",
  default: null,
});

export default columnSpacesState;
