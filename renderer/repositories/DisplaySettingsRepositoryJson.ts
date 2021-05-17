import { DisplaySettings } from '../models/DisplaySettings';
import { RepositoryJson } from './RepositoryJson';

export class DisplaySettingsRepositoryJson extends RepositoryJson<DisplaySettings> {

  model = DisplaySettings;
  dbFileName: string = "display_settings.json";
  initialDB: any = {}       //TODO モックなので後で直す

  constructor() {
    super();
  }

}
