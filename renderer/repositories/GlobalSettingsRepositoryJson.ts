import { GlobalSettings } from '../models/GlobalSettings';
import { RepositoryJson } from './RepositoryJson';
import { DbFileNameEnum } from '../resources/enums/app';

export class GlobalSettingsRepositoryJson extends RepositoryJson<GlobalSettings> {

  model = GlobalSettings;
  dbFileName: string = DbFileNameEnum.GLOBAL_SETTINGS;
  initialDB: any = {}       //TODO モックなので後で直す

  constructor() {
    super();
  }

}
