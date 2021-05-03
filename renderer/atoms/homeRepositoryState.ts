import { atom } from 'recoil';
import { columnSpacesType } from '../@types/app';
import { DB_FILE_PATH, PUBLIC_PATH } from '../consts/path';
import { HomeRepositoryJson } from '../repositories/HomeRepositoryJson';

const homeRepositoryState = atom<any>({
  key: "homeRepository",
  default: new HomeRepositoryJson({
    dbFilePath: DB_FILE_PATH,
    publicPath: PUBLIC_PATH
  })
});

export default homeRepositoryState;
