import { GlobalSettings } from '../models/GlobalSettings';
import { RepositoryJson } from './RepositoryJson';

export class GlobalSettingsRepositoryJson extends RepositoryJson<GlobalSettings> {

  model = GlobalSettings;
  dbFileName: string = "global_settings.json";
  initialDB: any = {}       //TODO モックなので後で直す

  constructor() {
    super();
  }


}
