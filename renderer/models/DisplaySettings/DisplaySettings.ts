import assert from "assert";
import { DisplaySetting } from ".";
import { array_move } from "../../modules/array";

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

  // 指定カラムスペースの表示設定配列の順番を変える
  updateDisplaySettingOrder(columnSpaceId: string, fromIndex: number, toIndex: number): DisplaySettings {
    this._children[columnSpaceId] = array_move(this._children[columnSpaceId], fromIndex, toIndex);
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

  /*
   * 指定カラムスペースの指定カラムに関わる表示設定をいい感じに削除
   *
   * 消す対象
   *  同じカラムスペース内の全設定を走査して以下を探して消す
   *  ・mainColumnと指定のカラムIDかぶるものは、表示設定ごと消す
   *  ・sortColumnsで消すIDあるものはそこから消す
   */
  //TODO テストちゃんとする
  removeSpecificColumnAssociatedItem(columnSpaceId: string, columnId: string): DisplaySettings {

    // 指定カラムスペースに既存表示設定が無いなら、指定カラムスペースのキー自体も作られてないので、まずキーを作る
    if (!this._children[columnSpaceId]) {
      this._children[columnSpaceId] = [];
    }

    this._children[columnSpaceId].forEach((displaySetting, index)=> {
      // メインカラムが消すカラムになってるならその設定ごと消す
      if (displaySetting.mainColumn === columnId) {
        this._children[columnSpaceId].splice(index, 1);
        return;
      }

      // もしソートカラムの長さが1で、その中の値が指定のカラムなら、不変条件が成り立たなくて面倒なのでいっそその設定ごと消す
      if (displaySetting.sortColumns.length === 1 && displaySetting.sortColumns[0] === columnId) {
        this._children[columnSpaceId].splice(index, 1);
        return;
      }
    })

    // 他消す
    this._children[columnSpaceId].forEach((displaySetting, index)=> {
      this._children[columnSpaceId][index] = displaySetting.removeSpecificColumnAssociatedItem(columnId);
    })

    return new DisplaySettings(this);
  }

}
