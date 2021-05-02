import { readFileSync, copyFile, copyFileSync, writeFileSync, existsSync, exists } from 'fs'
import { parse } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { IHomeRepository } from '../@types/repositories'
import { columnSpacesType, columnsType } from '../@types/app'

export class HomeRepositoryJson implements IHomeRepository{

  columnSpaceDB = null;
  currentColumnSpaceUUID: string = null;
  dbFilePath: string = null;
  publicPath: string = null;
  initialDB: columnSpacesType = {
    "test_column_space": {
      "name": "test_column_space",
      "columns": {
        "test_file_column_uuid": {
          "name": "test_file_column",
          "type": "file",
          "collapsable": false,
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

  async readOrCreateDB(): Promise<columnSpacesType> {
    this.columnSpaceDB = existsSync(this.dbFilePath)
      ? await this.readDB()
      : await this.createDB();

    return this.columnSpaceDB;
  }

  async readDB(): Promise<columnSpacesType>  {
    return JSON.parse(readFileSync(this.dbFilePath, "utf8"));
  }

  async createDB(): Promise<columnSpacesType> {
    this.saveDB(this.initialDB);
    return this.initialDB;
  }

  async addColumnSpace(columnSpaceName): Promise<columnSpacesType> {
    this.columnSpaceDB[uuidv4()] = {
      "name": columnSpaceName,
      "columns": {},
    }
    this.saveDB(this.columnSpaceDB);
    return this.columnSpaceDB;
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

  async uploadFile(fileObject, targetColumnUUID): Promise<columnSpacesType> {
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
    this.saveDB(newColumnSpaceDB);

    console.log("DB書き出し完了");
    return newColumnSpaceDB;
  }

  private saveDB(DBJson: columnSpacesType, dbFilePath: string = this.dbFilePath) {
    writeFileSync(dbFilePath, JSON.stringify(DBJson, null, "\t"), "utf8")
  }

}