// interface ConstructorArgs {
//   id?: string,
//   columnSpaceId: string,
//   cellId: string,
// }

// interface FromJsonArgs {
//   id: string,
//   columnSpaceId: string,
//   cellId: string,
// }

// export class RelatedCell {
//   private _id: string;
//   private _columnSpaceId: string;
//   private _cellId: string;

//   get id() { return this._id; }
//   get columnSpaceId() { return this._columnSpaceId; }
//   get cellId() { return this._cellId; }

//   constructor(props: ConstructorArgs) {
//     //TODO 不変条件
//     const id = props.id;
//     this._id = id;
//     this._columnSpaceId = props.columnSpaceId;
//     this._cellId = props.cellId;
//   }

//   static fromJSON(json: FromJsonArgs) {
//     return new RelatedCell({
//       id: json.id,
//       columnSpaceId: json.columnSpaceId,
//       cellId: json.cellId,
//     })
//   }

//   toJSON() {
//     return {
//       id: this._id,
//       columnSpaceId: this._columnSpaceId,
//       cellId: this._cellId,
//     }
//   }

// }