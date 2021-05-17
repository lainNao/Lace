interface ConstructorArgs {
  hasInitialized?: boolean;
}

export class GlobalSettings {

  private _hasInitialized;

  get hasInitialized() { return this._hasInitialized; }

  constructor(args: ConstructorArgs) {
    this._hasInitialized = args.hasInitialized;
  }

  static fromJSON(json) {
    return new GlobalSettings({
      hasInitialized: json.hasInitialized,
    });
  }

  toJSON() {
    return {
      hasInitialized: this._hasInitialized,
    }
  }

}