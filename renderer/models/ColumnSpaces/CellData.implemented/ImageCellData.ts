import { CellData } from "../CellData";
import path from "path";

interface ConstructorArgs {
  path: string,
}

interface FromJsonArgs {
  name: string,
  basename: string,
  extname: string,
  path: string,
}

export class ImageCellData implements CellData {
  private _name: string;
  private _basename: string;
  private _path: string;
  private _extname: string;

  get name() { return this._name; }
  get basename() { return this._basename; }
  get path() { return this._path; }
  get extname() { return this._extname; }

  constructor(args: ConstructorArgs) {
    this._path = args.path;
    this._basename = path.basename(args.path);
    this._extname = path.extname(args.path);
    this._name = path.basename(this._path, this._extname);
  }

  static fronJSON(json: FromJsonArgs): CellData {
    return new ImageCellData({
      path: json.path,
    });
  }

  toJSON() {
    return {
      name: this._name,
      path: this._path,
      extname: this._extname,
      basename: this._basename,
    }
  }

}
