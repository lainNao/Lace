import { RelatedCell } from "./RelatedCell";

export class RelatedCells {

  children: RelatedCell[];

  constructor(args?) {
    //todo: 不変条件
    this.children = (args == undefined) ? [] : args.children;
  }

  static fromJson(json) {
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

}
