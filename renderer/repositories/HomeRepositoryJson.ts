import { readFileSync, copyFile, copyFileSync, writeFileSync, existsSync } from 'fs'
import { parse } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { IHomeRepository } from '../@types/repositories'
import { columnspaceDBType, currentMainDisplayedColumnDatasType } from '../@types'

export class HomeRepositoryJson implements IHomeRepository{

  // メモリ上に読み込んだDB
  columnSpaceDB = null;

  // 現芸のカラムスペースのUUID
  currentColumnSpaceUUID = null;

  // DBファイルのパス
  dbFilePath = null;

  // publicフォルダのパス
  publicPath = null;

  // 初期状態のDB（後で別ファイルに移したり、あと「test_column_space」とか「test_file_column_uuid」とかを動的にする
  initialDB: columnspaceDBType = {
    "test_column_space": {
      "name": "test_column_space",
      "columns": {
        "test_file_column_uuid": {
          "name": "test_file_column",
          "type": "file",
          "collapsable": false,
          "childColumns": [
          ],
          "datas": {
          }
        }
      }
    },
  }

  constructor(options) {
    this.dbFilePath = options.dbFilePath;
    this.currentColumnSpaceUUID = options.currentColumnSpaceUUID;
    this.publicPath = options.publicPath;
  }

  async readOrCreateDB(): Promise<columnspaceDBType> {

    this.columnSpaceDB = existsSync(this.dbFilePath)
      ? await this.createDB()
      : await this.readDB();

    return this.columnSpaceDB;
  }

  async readDB(): Promise<columnspaceDBType>  {
    return JSON.parse(readFileSync(this.dbFilePath, "utf8"));
  }

  async createDB(): Promise<columnspaceDBType> {
    writeFileSync(this.dbFilePath, JSON.stringify(this.initialDB, null, 2));
    return this.initialDB;
  }

  async getSavePathWithoutDuplication(filenameWithExtension, targetColumnUUID): Promise<string> {
    const savedDirectory = `userdata/column_spaces/${this.currentColumnSpaceUUID}/${targetColumnUUID}/`;
    const fileExtension = parse(filenameWithExtension).ext;
    const fileName = parse(filenameWithExtension).name;
    let savedFileName = fileName + fileExtension;

    for (let i=1; ; i++) {
      const sameNameExists = existsSync(this.publicPath + savedDirectory + savedFileName)
      if (!sameNameExists) {
        break;
      }
      savedFileName = fileName + `(${i})` + fileExtension;
    }

    return savedDirectory + savedFileName;
  }

  async uploadFile(fileObject, targetColumnUUID): Promise<columnspaceDBType> {
    const filePath = await this.getSavePathWithoutDuplication(fileObject.name, targetColumnUUID);
    const realFilePath = this.publicPath + filePath;
    const currentColumnSpaceDB = await this.readDB();

    let newColumnSpaceDB = Object.assign({}, currentColumnSpaceDB);
    newColumnSpaceDB[this.currentColumnSpaceUUID].columns[targetColumnUUID].datas[uuidv4()] = {
      path: filePath,
      type: fileObject.type,
      name: parse(realFilePath).name + parse(realFilePath).ext,
      childsColumnsDatas: {},    //この時点では空にし、後々セットする時にこの中身は持たせる。なぜならば、ここでファイル取り込みした後にchild_columnsの中の要素が増える可能性があるため。
    };

    // エラーハンドリングもする
    copyFileSync(fileObject.path, realFilePath)
    writeFileSync(this.dbFilePath, JSON.stringify(newColumnSpaceDB, null, "\t"), "utf8")

    console.log("DB書き出し完了");
    return newColumnSpaceDB;
  }

}