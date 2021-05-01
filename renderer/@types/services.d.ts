import { HomeRepository } from './repositories/HomeRepository'

export interface IHomeService {
  repository: HomeRepository;
  readOrCreateDB: () => Promise<columnspaceDBType>;
  uploadFiles: (files, targetColumnUUID) => Promise<columnspaceDBType>;
}

