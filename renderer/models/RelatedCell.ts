
export class RelatedCell {
  id: string;
  columnSpaceId: string;
  cellId: string;

  constructor(props) {
    //TODO 不変条件
    const id = props.id;
    this.id = id;
    // this.name = props.name;
    this.columnSpaceId = props.columnSpaceId;
    this.cellId = props.cellId;
  }

}