import { assert } from 'console';
import fs from 'fs'
import path from 'path';
import { ColumnSpaces } from '../models/ColumnSpaces';
import { DbFileNameEnum } from '../resources/enums/app';
import { RepositoryJson } from './RepositoryJson';

export class ColumnSpacesRepositoryJson extends RepositoryJson<ColumnSpaces> {

  model = ColumnSpaces;
  dbFileName: string = DbFileNameEnum.COLUMN_SPACES;
  private columnDataDir: string = "file_datas"; //TODO この定数どっかに移す
  private dustBoxDirName: string = "file_datas_dust_box";
  initialDB: any = [       //TODO モックなので後で直す
    {
      "id": "1111",
      "name": "サンプルカラムスペース",
      "childColumnSpaces": [],
      "columns": [
        {
          "id": "2222",
          "name": "サンプルカラム",
          "type": "Text",
          "cells": [
            {
              "id": "3333",
              "type": "Text",
              "data": {
                "text": "サンプルテキストカラムです"
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

  // ゴミ箱にファイルをコピーし、ゴミ箱内に作られたファイルパスを返す
  async copyCellFileToDustBox(originalFilePath: string, columnSpaceId: string, columnId: string, fileName: string): Promise<string> {
    assert(originalFilePath, "originalFilePathが空です")
    assert(columnSpaceId, "columnSpaceIdが空です");
    assert(columnId, "columnIdが空です");
    assert(fileName, "fileNameが空です");

    // ゴミ箱内に入れるファイルパスを作る
    const applicationDirPath = await this.getSaveDirAbsolutePath();
    const dustedFileDirPath = path.join(applicationDirPath, this.dustBoxDirName, columnSpaceId, columnId);
    await this.createDirectoryIfNotExists(dustedFileDirPath);
    const dustedFilePath = path.join(dustedFileDirPath, fileName);

    // 元ファイルからゴミ箱にコピーする
    await fs.promises.copyFile(originalFilePath, dustedFilePath)

    return dustedFilePath;
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
