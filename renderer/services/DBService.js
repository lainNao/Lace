import { readFileSync, writeFileSync, existsSync } from 'fs'
import { databaseFilePath } from '../consts/path'
import { promisify } from 'util'

/*
  こういうのは一度処理ができたら随時typescript化
*/
export class DBService {

  constructor(options) {
    this.databaseFilePath = options.databaseFilePath
  }

  initialDB = {
    "test_column_space": {
      "name": "test_column_space",
      "columns": {
        "test_file_column_uuid": {
          "name": "test_file_column",
          "type": "file",
          "collapsable": false,
          "child_columns": [
          ],
          "datas": {
          }
        }
      }
    }
  }

  async readOrCreateDatabase() {
    if (!existsSync(this.databaseFilePath)) {
      return await this.createDatabase();
    }

    return this.readDatabase(this.databaseFilePath)
  }

  async createDatabase() {
    writeFileSync(this.databaseFilePath, JSON.stringify(this.initialDB, null, 2))
    return this.initialDB
  }

  async readDatabase(dbPath) {
    return JSON.parse(readFileSync(dbPath, "utf8"))
  }
}

