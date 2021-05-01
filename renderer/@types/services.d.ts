import { HomeRepository } from './repositories/HomeRepository'

export interface IHomeService {
  repository: HomeRepository;
  readOrCreateDB(): Promise<any>;
  uploadFiles(files, targetColumnUUID): Promise<any>;
}

