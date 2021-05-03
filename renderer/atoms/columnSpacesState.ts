import { atom } from 'recoil';
import { columnSpacesType } from '../@types/app';

const columnSpacesState = atom<columnSpacesType>({
  key: "columnSpaces",
  default: {                                //モックなので後で直す
    "123456789-1234-1234-1234-123456789123": {
      "name": "test_column_space",
      "childColumnSpaces": {},
      "columns": {
        "C23456789-C234-C234-C234-C23456789123": {
          "name": "test_file_column",
          "type": "file",
          "collapsable": false,
          "datas": {
          }
        }
      }
    },
  },
});

export default columnSpacesState;
