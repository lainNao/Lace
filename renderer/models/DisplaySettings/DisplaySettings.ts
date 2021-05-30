import { DisplaySetting } from ".";

type ColumnSpacesHasArray = {
  [columnSpaceUuid: string]: DisplaySetting[]
}

interface ConstructorArgs {
  children?: ColumnSpacesHasArray;
}

export class DisplaySettings {

  private _children: ColumnSpacesHasArray;

  get children() { return this._children; }

  constructor(args: ConstructorArgs) {
    this._children = (args == null) ? {} : args.children;
  }

  static fromJSON(json) {
    const children = {};
    for (let [columnSpaceId, displaySettings] of Object.entries<[]>(json)) {
      children[columnSpaceId] = [];
      children[columnSpaceId] = displaySettings.map(displaySetting => DisplaySetting.fromJSON(displaySetting));
    }

    return new DisplaySettings({
      children,
    });
  }

  toJSON() {
    return this._children;
  }

  addDisplaySetting(columnSpaceId: string, displaySetting: DisplaySetting): DisplaySettings {

    // 指定カラムスペースに既存表示設定が無いなら、指定カラムスペースのキー自体も作られてないので、まずキーを作る
    if (!this._children[columnSpaceId]) {
      this._children[columnSpaceId] = [];
    }

    this._children[columnSpaceId].push(displaySetting);
    return this;
  }

  updateDisplaySetting(columnSpaceId: string, displaySetting: DisplaySetting): DisplaySettings {
    this._children[columnSpaceId] = this._children[columnSpaceId].map(ds => {
      if (ds.id !== displaySetting.id) {
        return displaySetting;
      }

      return ds;
    });
    return this;
  }

  removeDisplaySetting(columnSpaceId: string, displaySettingId): DisplaySettings {
    this._children[columnSpaceId] = this._children[columnSpaceId].filter(displaySetting => displaySetting.id !== displaySettingId);
    return this;
  }

}
