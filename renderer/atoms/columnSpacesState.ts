import { atom } from 'recoil';
import { ColumnSpaces } from '../models/ColumnSpaces';

const columnSpacesState = atom<ColumnSpaces>({
  key: "columnSpaces",
  default: null,
});

export default columnSpacesState;
