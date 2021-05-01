import React, { useState, useEffect, Dispatch } from 'react';
import { columnspaceDBType, currentMainDisplayedColumnDatasType } from '../@types'
import { IHomeService } from '../@types/services'
import { useService } from '../hooks/useService'
import { useHomeServiceProps } from '../@types/hooks'
import { DB_FILE_PATH, PUBLIC_PATH } from '../consts/path';
import { HomeRepositoryJson } from '../repositories/HomeRepositoryJson';
import { HomeService } from '../services/HomeService';

export function useHomeService(props: useHomeServiceProps) : {
  service: IHomeService,
  columnSpaceDB: columnspaceDBType,
  currentColumnSpaceUUID: any,
  currentMainDisplayedColumnDatas: any,
  currentMainDisplayedColumnUUID: string,
  setColumnSpaceDB: Dispatch<() => columnspaceDBType>,
  setCurrentMainDisplayedColumnDatas: Dispatch<() => any>,
} {

  const [service] = useService<IHomeService>(new HomeService({
      repository: new HomeRepositoryJson({
        dbFilePath: DB_FILE_PATH,
        currentColumnSpaceUUID: props.currentColumnSpaceUUID,
        publicPath: PUBLIC_PATH
      }),
    }),
  )
  const [columnSpaceDB, setColumnSpaceDB] = useState<columnspaceDBType>(null);
  const [currentMainDisplayedColumnDatas, setCurrentMainDisplayedColumnDatas] = useState<currentMainDisplayedColumnDatasType>();

  // DBの読み込み
  useEffect(() => {
    const readOrCreateDB = async () => {
      setColumnSpaceDB(await service.readOrCreateDB());
    }
    if (service) {
      readOrCreateDB();
    }
  }, [service]);

  // currentMainDisplayedColumnDatasの読み込み
  useEffect(() => {
    if (columnSpaceDB == null) {
      return;
    }
    setCurrentMainDisplayedColumnDatas(columnSpaceDB[props.currentColumnSpaceUUID].columns[props.currentMainDisplayedColumnUUID].datas)
  }, [columnSpaceDB])

  return {
    service,
    columnSpaceDB,
    currentColumnSpaceUUID: props.currentColumnSpaceUUID,
    currentMainDisplayedColumnUUID: props.currentMainDisplayedColumnUUID,
    currentMainDisplayedColumnDatas,
    setColumnSpaceDB,
    setCurrentMainDisplayedColumnDatas,
  };
}