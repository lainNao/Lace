import { RelatedCells } from '../models/RelatedCells';
import { RepositoryJson } from './RepositoryJson';

export class RelatedCellsRepositoryJson extends RepositoryJson<RelatedCells> {

  model = RelatedCells;
  dbFileName: string = "related_cells.json";
  initialDB: any = {}       //TODO モックなので後で直す

  constructor() {
    super();
  }

}
