import { readFileSync,readFile, copyFile, writeFileSync, existsSync, access,  mkdirSync } from 'fs'
import { parse } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { DB_FILE_PATH, PUBLIC_PATH } from '../consts/path';
import { ColumnSpaces } from '../models/ColumnSpaces';

export class ColumnSpacesRepositoryJson {

  columnSpaces: ColumnSpaces = null;
  dbFilePath: string = DB_FILE_PATH;
  publicPath: string = PUBLIC_PATH;
  initialDB: any = [       //モックなので後で直す
    {
      "id": "1111",
      "name": "test_column_space",
      "childColumnSpaces": [],
      "columns": [
        {
          "id": "2222",
          "name": "test_file_column",
          "type": "file",
          "collapsable": false,
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

  save(columnSpaces: ColumnSpaces): ColumnSpaces {
    //todo　オブジェクトをjsonに変換してそのままファイルに保存。toJson的なのも実装？
    return columnSpaces;
  }

  readOrCreateDB(): ColumnSpaces {//todo ここらへんの「DB」的な命名が古いままなので見合う名前に直して
    try {
      return this.readDB();
    } catch {
      return this.createDB()
    }
  }

  readDB(): ColumnSpaces {  //todo ここらへんの「DB」的な命名が古いままなので見合う名前に直して
    const fileString = readFileSync(this.dbFilePath, "utf-8");
    return ColumnSpaces.fromJson(JSON.parse(fileString));
  }

  createDB(): ColumnSpaces {//todo ここらへんの「DB」的な命名が古いままなので見合う名前に直して
    this.saveFile(this.initialDB);
    return ColumnSpaces.fromJson(this.initialDB);
  }

  saveFile(columnSpaces: ColumnSpaces): void {
    //todo 駄目なら例外　というかこれとsaveかぶってない？ createDBもいらなくない？そこらへん片付けて
    writeFileSync(this.dbFilePath, JSON.stringify(columnSpaces, null, "\t"), "utf8")
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



  private getCellSaveDirectoryOf = (targetColumnUUID: string) => {
    return `userdata/column_spaces/${targetColumnUUID}/`;
  }

  private getSaveFileName(saveDirectory, fileName, extension) {
    for (let i=0; ; i++) {
      const path = (i === 0)
        ? this.publicPath + saveDirectory + fileName + extension
        : this.publicPath + saveDirectory + fileName + `(${i})` + extension

      const samePathExists = existsSync(path)
      if (samePathExists) {
        continue;
      }
      return path
    }
  }

  private getSavePathWithoutDuplication(filenameWithExtension, targetColumnUUID): string {
    const saveDirectory = this.getCellSaveDirectoryOf(targetColumnUUID);
    const saveFileName = this.getSaveFileName(this.publicPath, parse(filenameWithExtension).name, parse(filenameWithExtension).ext);
    return saveDirectory + saveFileName;
  }

}