import { IHomeRepository } from '../@types/repositories'
import { IHomeService } from '../@types/services'

/*
  こういうのは一度処理ができたら随時typescript化
*/
export class HomeService implements IHomeService {

  repository: IHomeRepository;

  constructor(options) {
    this.repository = options.repository;
  }

  async readOrCreateDB() {
    return this.repository.readOrCreateDB();
  }

  async uploadFiles(files, targetColumnUUID) {
    let newColumnSpaceDB;

    for (let i=0; i<files.length; i++) {
      //トランザクションとか考慮？
      newColumnSpaceDB = await this.repository.uploadFile(files[i], targetColumnUUID);
    }

    console.log('ファイル取り込み完了');
    return newColumnSpaceDB
  }
}

