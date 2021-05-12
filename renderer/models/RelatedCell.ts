
export class RelatedCell {
  private _id: string;
  private _columnSpaceId: string;
  private _cellId: string;

  constructor(props) {
    //TODO 不変条件
    const id = props.id;
    this._id = id;
    this._columnSpaceId = props.columnSpaceId;
    this._cellId = props.cellId;
  }

  get id() { return this._id; }
  get columnSpaceId() { return this._columnSpaceId; }
  get cellId() { return this._cellId; }

  toJSON() {
    return {
      id: this._id,
      columnSpaceId: this._columnSpaceId,
      cellId: this._cellId,
    }
  }

}