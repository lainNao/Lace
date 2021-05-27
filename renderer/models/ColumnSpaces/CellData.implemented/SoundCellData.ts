import { CellData } from "../CellData";
import path from "path";

interface ConstructorArgs {
  path: string,
  alias?: string,
}

interface FromJsonArgs {
  name: string,
  basename: string,
  extname: string,
  path: string,
  arias: string,
}

export class SoundCellData implements CellData {
  private _name: string;
  private _basename: string;
  private _path: string;
  private _extname: string;
  private _alias: string;

  get name() { return this._name; }
  get basename() { return this._basename; }
  get path() { return this._path; }
  get extname() { return this._extname; }
  get alias() { return this._alias; }

  constructor(args: ConstructorArgs) {
    this._path = args.path;
    this._basename = path.basename(args.path);
    this._extname = path.extname(args.path);
    this._name = path.basename(this._path, this._extname);
    this._alias = args.alias;
  }

  static fronJSON(json: FromJsonArgs): CellData {
    return new SoundCellData({
      path: json.path,
    });
  }

  toJSON() {
    return {
      name: this._name,
      path: this._path,
      extname: this._extname,
      basename: this._basename,
      alias: this._alias,
    }
  }

}
