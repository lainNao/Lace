import { IHomeRepository } from "./repositories"

export interface IHomeService {
  repository: IHomeRepository;
  readOrCreateDB: () => Promise<columnSpacesType>;
  uploadFiles: (files, targetColumnUUID) => Promise<columnSpacesType>;
}

