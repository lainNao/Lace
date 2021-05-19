import fs from 'fs'
import path from 'path';
import { Cells, ColumnSpace, ColumnSpaces } from '../models/ColumnSpaces';
import { RepositoryJson } from './RepositoryJson';

export class ColumnSpacesRepositoryJson extends RepositoryJson<ColumnSpaces> {

  model = ColumnSpaces;
  dbFileName: string = "database.json";
  private columnDataDir: string = "file_datas"; //TODO この定数どっかに移す
  initialDB: any = [       //TODO モックなので後で直す
    {
      "id": "1111",
      "name": "test_column_space",
      "childColumnSpaces": [],
      "columns": [
        {
          "id": "2222",
          "name": "test_text_column",
          "type": "Text",
          "cells": [
            {
              "id": "3333",
              "type": "Text",
              "data": {
                "text": "テスト文章です"
              }
            }
          ]
        }
      ]
    },
  ]

  constructor() {
    super();
  }

  // TODO これリポジトリのやつじゃないのでは？後でこれ使ってるところを直す
  async updateDescendantColumnSpace(columnSpace: ColumnSpace): Promise<ColumnSpaces> {
    if (!this.data) {
      this.data = await this.read();
    }
    this.data = this.data.updateDescendantColumnSpace(columnSpace);
    return await this.save(this.data);
  }

  //TODO エラーハンドリング
  async saveColumnFiles(columnSpaceId: string, columnId: string, paths: string[]): Promise<string[]> {
    const saveFilePaths = [];
    for (const path of paths) {
      const saveFilePath = await this.saveColumnFile(columnSpaceId, columnId, path);
      saveFilePaths.push(saveFilePath);
    }

    return saveFilePaths;
  }

  async saveColumnFile(columnSpaceId: string, columnId: string, localFilePath: string): Promise<string> {
    const fileName = path.basename(localFilePath);
    const saveFilePath = await this.createColumnDataSavePathWithoutDuplication(fileName, columnSpaceId, columnId);

    // TODO エラーハンドリング
    await fs.promises.copyFile(localFilePath, saveFilePath)

    return saveFilePath;
  }

  private async createColumnDataSavePathWithoutDuplication(fileName: string, columnSpaceId: string,columnId: string): Promise<string> {
    const saveDirPath = await this.createColumnDataDirAbsolutePath(columnSpaceId, columnId);
    const saveFilePath = this.getSaveFilePathWithdouDuplication(saveDirPath, path.parse(fileName).name, path.parse(fileName).ext);
    return saveFilePath;
  }

  private async createColumnDataDirAbsolutePath(columnSpaceId: string, columnId: string): Promise<string> {
    const applicationDirPath = await this.getSaveDirAbsolutePath();
    const saveDirPath = path.join(applicationDirPath, this.columnDataDir, columnSpaceId, columnId);
    await this.createDirectoryIfNotExists(saveDirPath);
    return path.join(saveDirPath);
  }

  private async createDirectoryIfNotExists(dirAbsolutePath: string): Promise<string> {
    if (!fs.existsSync(dirAbsolutePath)){
      return await fs.promises.mkdir(dirAbsolutePath, { recursive: true });
    }
  }

  private getSaveFilePathWithdouDuplication(saveDirAbsolutePath: string, fileName: string, extension: string) {
    for (let i=0; ; i++) {
      const saveFilePath = (i === 0)
        ? path.join(saveDirAbsolutePath, fileName + extension)
        : path.join(saveDirAbsolutePath, fileName + `(${i})` + extension)

      const samePathExists = fs.existsSync(saveFilePath)
      if (samePathExists) {
        continue;
      }
      return saveFilePath;
    }
  }


}
