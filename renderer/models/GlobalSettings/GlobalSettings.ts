
export enum GlobalSettingKeys {
  CUSTOM_SAVE_DIR_PATH = "customSaveDirPath",
}

type GlobalSetting = {
  [key: string]: any,
}

export class GlobalSettings {

  private _data: GlobalSetting;

  get data() { return this._data; }

  constructor(args: GlobalSetting) {
    //TODO 不変条件　↑に存在しないキーが来たら保存しないとか、それぞれのデータ的に値が正しいかとか　例えばCUSTOM_SAVVE_DIR_PATHだったらちゃんとディレクトリパスとしてvalidかどうかなど
    this._data = args;
  }

  static fromJSON(json) {
    return new GlobalSettings(json);
  }

  toJSON() {
    return this._data;
  }

  updateGlobalSetting(key: string, value: any): GlobalSettings {
    this._data[key] = value;
    return new GlobalSettings(this._data);
  }

}