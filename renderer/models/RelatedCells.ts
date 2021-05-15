import { RelatedCell } from "./RelatedCell";

interface RelatedCellsConstructorArgs {
  children: RelatedCell[],
}

export class RelatedCells {

  private _children: RelatedCell[];

  get children(): RelatedCell[] { return this._children}

  constructor(args?: RelatedCellsConstructorArgs) {
    //TODO: 不変条件
    this._children = (args == undefined) ? [] : args.children;
  }

  static fromJSON(json) {
    return new RelatedCells({
      children: json.map((relatedCell) => {
        return RelatedCell.fromJSON({
          id: relatedCell.id,
          columnSpaceId: relatedCell.columnSpaceId,
          cellId: relatedCell.cellId,
        })
      })
    });
  }

  toJSON() {
    return this._children;
  }

  mapChildren(callback: (value: RelatedCell, index: number, array: RelatedCell[]) => unknown): unknown[]  {
    return this._children.map(callback);
  }
}
