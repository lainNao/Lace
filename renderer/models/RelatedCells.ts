import { RelatedCell } from "./RelatedCell";

export class RelatedCells {

  children: RelatedCell[];

  constructor(args?) {
    //TODO: 不変条件
    this.children = (args == undefined) ? [] : args.children;
  }

  static fromJSON(json) {
    const children = json.map((relatedCell) => {
      return new RelatedCell({
        id: relatedCell.id,
        columnSpaceId: relatedCell.columnSpaceId,
        cellId: relatedCell.cellId,
      })
    })
    return new RelatedCells({
      children
    });
  }

  toJSON(key) {
    return this.children;
  }

}
