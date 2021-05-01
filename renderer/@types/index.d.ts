export type columnspaceDBType = {
  [columnSpaceName :string]: {
    name: string,
    columns: currentMainDisplayedColumnDatasType,
  },
}

export type currentMainDisplayedColumnDatasType = {
  [columnUuid: string]: {
    name: string,
    type: string,
    collapsable: boolean,
    childColumns: Array<string>,
    datas: any
  }
}