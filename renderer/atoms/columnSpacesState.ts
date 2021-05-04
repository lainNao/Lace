import { atom } from 'recoil';
import { ColumnSpaces } from '../models/ColumnSpaces';

const columnSpacesState = atom<any>({ //todo any
  key: "columnSpaces",
  default: null,
});

export default columnSpacesState;
