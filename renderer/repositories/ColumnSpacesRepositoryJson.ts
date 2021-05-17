import { ColumnSpace, ColumnSpaces } from '../models/ColumnSpaces';
import { RepositoryJson } from './RepositoryJson';

export class ColumnSpacesRepositoryJson extends RepositoryJson<ColumnSpaces> {

  model = ColumnSpaces;
  dbFileName: string = "database.json";
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

  // TODO これリポジトリのやつじゃないのでは？
  async updateDescendantColumnSpace(columnSpace: ColumnSpace): Promise<ColumnSpaces> {
    if (!this.data) {
      this.data = await this.read();
    }
    this.data = this.data.updateDescendantColumnSpace(columnSpace);
    return await this.save(this.data);
  }


}
