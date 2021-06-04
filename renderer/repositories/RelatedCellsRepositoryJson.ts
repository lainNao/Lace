import { RelatedCells } from '../models/RelatedCells';
import { RepositoryJson } from './RepositoryJson';
import { DbFileNameEnum } from '../resources/enums/app';

export class RelatedCellsRepositoryJson extends RepositoryJson<RelatedCells> {

  model = RelatedCells;
  dbFileName: string = DbFileNameEnum.RELATED_CELLS;
  initialDB: any = {}       //TODO モックなので後で直す

  constructor() {
    super();
  }

}
