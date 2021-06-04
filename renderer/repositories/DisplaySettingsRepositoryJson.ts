import { DisplaySettings } from '../models/DisplaySettings';
import { RepositoryJson } from './RepositoryJson';
import { DbFileNameEnum } from '../resources/enums/app';

export class DisplaySettingsRepositoryJson extends RepositoryJson<DisplaySettings> {

  model = DisplaySettings;
  dbFileName: string = DbFileNameEnum.DISPLAY_SETTINGS;
  initialDB: any = {}       //TODO モックなので後で直す

  constructor() {
    super();
  }

}
