import fs from 'fs'
import path from 'path';
import { DB_FILE_PATH } from '../consts/path';
import { ColumnSpaces } from '../models/ColumnSpaces';
import { getSaveDirPath } from '../modules/ipc';

// TODO 例外処理
// TODO ファイルシステム触るみたいなことができる処理はもしかしたらメインプロセス側に移したほうが良いかも。というかnode.js全般？そうなると変更大変になる。まだ不明というか調べるの面倒なだけ
export class ColumnSpacesRepositoryJson {

  dbFilePath: string = DB_FILE_PATH;
  initialDB: any = [       //TODO モックなので後で直す
    {
      "id": "1111",
      "name": "test_column_space",
      "childColumnSpaces": [],
      "columns": [
        {
          "id": "2222",
          "name": "test_file_column",
          "type": "file",
          "cells": [
            {
              "id": "3333",
              "path": null,
              "type": null,
              "name": "sample_file",
              "relatedCells":[]
            }
          ]
        }
      ]
    },
  ]

  constructor() {
  }

  async save(columnSpaces: ColumnSpaces): Promise<ColumnSpaces> {
    const userDataPath = await getSaveDirPath();
    await fs.promises.writeFile(path.join(userDataPath, this.dbFilePath), JSON.stringify(columnSpaces, null, "\t"), "utf8");
    return columnSpaces;
  }

  async readOrInitialize(): Promise<ColumnSpaces> {
    // TODO awaitしてるやつにtry-catch効かないかもなのであとで確認
    try {
      return await this.read();
    } catch {
      return await this.initialize()
    }
  }

  async read(): Promise<ColumnSpaces> {
    const userDataPath = await getSaveDirPath();
    const fileString = await fs.promises.readFile(path.join(userDataPath, this.dbFilePath), "utf-8");
    return ColumnSpaces.fromJSON(JSON.parse(fileString));
  }

  async initialize(): Promise<ColumnSpaces> {
    const userDataPath = await getSaveDirPath();
    const dbPath = path.join(userDataPath, this.dbFilePath);
    const dbDir = path.dirname(dbPath);

    // フォルダ無いならフォルダ作る
    if (!fs.existsSync(dbDir)) {
      await fs.promises.mkdir(dbDir, { recursive: true });
    }

    // 初期DBファイル作成
    await fs.promises.writeFile(dbPath, JSON.stringify(this.initialDB, null, "\t"), "utf8");
    return ColumnSpaces.fromJSON(this.initialDB);
  }

  // async uploadFile(fileObject, targetColumnUUID): Promise<columnSpacesType> {
  //   const filePath = await this.getSavePathWithoutDuplication(fileObject.name, targetColumnUUID);
  //   const realFilePath = this.publicPath + filePath;
  //   const currentcolumnSpaces = await this.readDB();

  //   let newcolumnSpaces = Object.assign({}, currentcolumnSpaces);
  //   // newcolumnSpaces[this.currentColumnSpaceUUID].columns[targetColumnUUID].datas[uuidv4()] = {
  //   //   path: filePath,
  //   //   type: fileObject.type,
  //   //   name: parse(realFilePath).name + parse(realFilePath).ext,
  //   //   childsColumnsDatas: {},    //この時点では空にし、後々セットする時にこの中身は持たせる。なぜならば、ここでファイル取り込みした後にchild_columnsの中の要素が増える可能性があるため。
  //   // };

  //   // エラーハンドリングもする。サービス側で一括でやったほうがいいかも
  //   copyFileSync(fileObject.path, realFilePath)
  //   this.saveFile(newcolumnSpaces);

  //   console.log("DB書き出し完了");
  //   return newcolumnSpaces;
  // }

  // private createColumnSpaceDirectory(columnSpaceName: string): string | void {
  //   // エラーハンドリングもする。サービス側で一括でやったほうがいいかも
  //   if (!existsSync(columnSpaceName)){
  //     mkdirSync(columnSpaceName);
  //   } else {
  //     throw new Error("既に存在しています");
  //   }
  // }



  // private async getCellSaveDirectoryOf(targetColumnUUID: string): Promise<string> {
  //   const userDataPath = await getSaveDirPath();
  //   return path.join(userDataPath, "userdata/column_spaces", targetColumnUUID) + "/";
  // }

  // private getSaveFileName(saveDirectory, fileName, extension) {
  //   for (let i=0; ; i++) {
  //     const path = (i === 0)
  //       ? this.publicPath + saveDirectory + fileName + extension
  //       : this.publicPath + saveDirectory + fileName + `(${i})` + extension

  //     const samePathExists = fs.existsSync(path)
  //     if (samePathExists) {
  //       continue;
  //     }
  //     return path
  //   }
  // }

  // private async getSavePathWithoutDuplication(filenameWithExtension, targetColumnUUID): Promise<string> {
  //   const saveDirectory = await this.getCellSaveDirectoryOf(targetColumnUUID);
  //   const saveFileName = this.getSaveFileName(this.publicPath, path.parse(filenameWithExtension).name, path.parse(filenameWithExtension).ext);
  //   return saveDirectory + saveFileName;
  // }

}