import React, { useState, useEffect, Dispatch } from 'react';
import { columnSpacesType, columnsType } from '../@types/app'
import { IHomeService } from '../@types/services'
import { useService } from '../hooks/useService'
import { useHomeServiceProps } from '../@types/hooks'
import { DB_FILE_PATH, PUBLIC_PATH } from '../consts/path';
import { HomeRepositoryJson } from '../repositories/HomeRepositoryJson';
import { HomeService } from '../services/HomeService';

export function useHomeService(props: useHomeServiceProps) : {
  service: IHomeService,
  columnSpaceDB: columnSpacesType,
  currentColumnSpaceUUID: any,
  currentMainDisplayedColumnUUID: string,
  setColumnSpaceDB: Dispatch<() => columnSpacesType>,
} {

  const [service] = useService<IHomeService>(new HomeService({
      repository: new HomeRepositoryJson({
        dbFilePath: DB_FILE_PATH,
        currentColumnSpaceUUID: props.currentColumnSpaceUUID,
        publicPath: PUBLIC_PATH
      }),
    }),
  )
  const [columnSpaceDB, setColumnSpaceDB] = useState<columnSpacesType>(null);

  // DBの読み込み
  useEffect(() => {
    const readOrCreateDB = async () => {
      setColumnSpaceDB(await service.readOrCreateDB());
    }
    if (service) {
      readOrCreateDB();
    }
  }, [service]);


  return {
    service,
    columnSpaceDB,
    currentColumnSpaceUUID: props.currentColumnSpaceUUID,
    currentMainDisplayedColumnUUID: props.currentMainDisplayedColumnUUID,
    setColumnSpaceDB,
  };
}