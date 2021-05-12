import { RelatedCell } from "./RelatedCell";

interface RelatedCellsConstructorArgs {
  children: RelatedCell[],
}

export class RelatedCells {

  private _children: RelatedCell[];

  constructor(args?: RelatedCellsConstructorArgs) {
    //TODO: 不変条件
    this._children = (args == undefined) ? [] : args.children;
  }

  get children(): RelatedCell[] { return this._children}

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

  toJSON() {
    return this._children;
  }

  mapChildren(callback: (value: RelatedCell, index: number, array: RelatedCell[]) => unknown): unknown[]  {
    return this._children.map(callback);
  }
}
