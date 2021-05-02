import { IHomeRepository } from '../@types/repositories'
import { columnSpacesType, columnsType } from '../@types/app'

export class HomeService {

  repository: IHomeRepository;

  constructor(options) {
    this.repository = options.repository;
  }

  async readOrCreateDB(): Promise<columnSpacesType> {
    return this.repository.readOrCreateDB();
  }

  async addColumnSpace(columnSpaceName): Promise<columnSpacesType> {
    return this.repository.addColumnSpace(columnSpaceName);
  }

  async uploadFiles(files, targetColumnUUID): Promise<columnSpacesType> {
    let newColumnSpaceDB: columnSpacesType;

    for (let i=0; i<files.length; i++) {
      //トランザクションとか考慮？
      newColumnSpaceDB = await this.repository.uploadFile(files[i], targetColumnUUID);
    }

    console.log('ファイル取り込み完了');
    return newColumnSpaceDB
  }
}

