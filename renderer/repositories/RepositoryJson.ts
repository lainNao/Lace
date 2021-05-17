
import fs from 'fs'
import path from 'path';
import { DB_DIR_PATH } from '../resources/consts/path';
import { getSaveDirPath } from '../modules/ipc';
import assert from 'assert'

export class RepositoryJson<T> {

  protected model: any; //オーバーライド必須　
  protected dbFileName: string; //オーバーライド必須
  protected initialDB: object; //オーバーライド必須
  //TODO initialDBの値については、初期化する際にinitializeメソッドの引数に渡したほうがいいと思う。わからんけど

  protected data: T;
  private dbDirPath: string = DB_DIR_PATH;
  private saveDirAbsolutePath: string;

  constructor() {
  }

  private get dbFileRelativePath(): string {
    assert(this.dbDirPath && this.dbFileName, "dbDirPathまたはdbFileNameが設定されていません");

    return path.join(this.dbDirPath, this.dbFileName);
  }

  private async getSaveDirAbsolutePath() : Promise<string> {
    if (this.saveDirAbsolutePath) {
      return this.saveDirAbsolutePath;
    }

    this.saveDirAbsolutePath = await getSaveDirPath();
    return this.saveDirAbsolutePath;
  }

  async save(data: T): Promise<T> {
    const saveDirPath = await this.getSaveDirAbsolutePath();
    await fs.promises.writeFile(path.join(saveDirPath, this.dbFileRelativePath), JSON.stringify(data, null, "\t"), "utf8");
    this.data = data;
    return this.data;
  }

  //TODO これは廃止する。read使う側でcatchなどして、ユーザーに確認して必要ならinitializeを改めて行うようにする
  async readOrInitialize(): Promise<T> {
    try {
      return await this.read();
    } catch {
      // TODO これ、readに失敗しただけでイニシャライズしちゃうのはきついのでは…　絶対に良くないと思う…　readとinitializeは実行タイミングはユーザーの選択によって分けたほうがいいと思う…
      return await this.initialize()
    }
  }

  async read(): Promise<T> {
    assert(this.model, "modelが設定されていません");
    assert(this.model.fromJSON, "modelにfromJSONが定義されていません");

    const saveDirPath = await this.getSaveDirAbsolutePath();
    const fileString = await fs.promises.readFile(path.join(saveDirPath, this.dbFileRelativePath), "utf-8");
    this.data = this.model.fromJSON(JSON.parse(fileString));

    return this.data;
  }

  async initialize(): Promise<T> {
    assert(this.model, "modelが設定されていません");
    assert(this.model.fromJSON, "modelにfromJSONが定義されていません");
    assert(this.initialDB, "initialDBが設定されていません")

    const saveDirPath = await this.getSaveDirAbsolutePath();
    const dbPath = path.join(saveDirPath, this.dbFileRelativePath);
    const dbDir = path.dirname(dbPath);

    // フォルダ無いならフォルダ作る
    if (!fs.existsSync(dbDir)) {
      await fs.promises.mkdir(dbDir, { recursive: true });
    }

    // 初期DBファイル作成
    await fs.promises.writeFile(dbPath, JSON.stringify(this.initialDB, null, "\t"), "utf8");
    return this.model.fromJSON(this.initialDB);
  }

}