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


}
