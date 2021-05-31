import assert from "assert";
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

    // カラムスペース配下のidにかぶりが無いこと
    DisplaySettings.isChildrenUnique(args.children);

    this._children = (args == null) ? {} : args.children;
  }

  static isChildrenUnique(children: ColumnSpacesHasArray | []) {
    Object.keys(children).forEach(columnSpaceId => {
      const ids = [];
      children[columnSpaceId].forEach(displaySetting => {
        ids.push(displaySetting.id);
      });
      assert.ok(children[columnSpaceId].length === new Set(ids).size, `${columnSpaceId}のDisplaySettingのidが重複しています`);
    })
  }

  static fromJSON(json) {
    const children = {};
    for (let [columnSpaceId, displaySettings] of Object.entries<[]>(json)) {
      children[columnSpaceId] = [];
      children[columnSpaceId] = displaySettings.map(displaySetting =>  DisplaySetting.fromJSON(displaySetting));
    }

    return new DisplaySettings({
      children,
    });
  }

  toJSON() {
    return this._children;
  }

  // 指定カラムスペースに、指定表示設定を追加
  addDisplaySetting(columnSpaceId: string, displaySetting: DisplaySetting): DisplaySettings {

    // 指定カラムスペースに既存表示設定が無いなら、指定カラムスペースのキー自体も作られてないので、まずキーを作る
    if (!this._children[columnSpaceId]) {
      this._children[columnSpaceId] = [];
    }

    this._children[columnSpaceId].push(displaySetting);
    return new DisplaySettings(this);
  }

  // 指定カラムスペース、指定表示設定をIDで探して更新
  updateDisplaySetting(columnSpaceId: string, displaySetting: DisplaySetting): DisplaySettings {
    this._children[columnSpaceId] = this._children[columnSpaceId].map(ds => {
      if (ds.id === displaySetting.id) {
        return displaySetting;
      }

      return ds;
    });

    return new DisplaySettings(this);
  }

  // 指定カラムスペース、表示設定IDの表示設定を削除
  removeDisplaySettingOfSpecificDisplaySettingId(columnSpaceId: string, displaySettingId): DisplaySettings {
    this._children[columnSpaceId] = this._children[columnSpaceId].filter(displaySetting => displaySetting.id !== displaySettingId);
    return new DisplaySettings(this);
  }

  // 指定カラムスペースの表示設定を全て削除
  removeDisplaySettingOfSpecificColumnSpaceId(columnSpaceId: string): DisplaySettings {
    delete this._children[columnSpaceId];
    return new DisplaySettings(this);
  }

}
