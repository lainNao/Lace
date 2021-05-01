export type columnspaceDB = {
  [columnSpaceName :string]: {
    name: string,
    columns: {
      [columnUuid: string]: {
        name: string,
        type: string,
        collapsable: boolean,
        childColumns: Array<string>,
        datas: any
      }
    }
  },
}