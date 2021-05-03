export type columnSpacesType = {
  [columnSpaceName :string]: columnSpaceType,
}

export type columnSpaceType = {
  name: string,
  columns: columnsType,
  childColumnSpaces: columnSpacesType,
}

export type columnsType = {
  [columnUuid: string]: columnType,
}

export type columnType = {
  name: string,
  type: string,
  collapsable: boolean,
  datas: any,
}

export type datasType = {
  [dataUuid: string]: dataType,
}

export type dataType = any;
