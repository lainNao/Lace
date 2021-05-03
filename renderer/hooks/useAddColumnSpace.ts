import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import columnSpacesState from "../atoms/columnSpacesState";
import { v4 as uuidv4 } from 'uuid'
import { columnSpacesType } from "../@types/app";
import { cloneDeep } from "lodash";
import homeRepositoryState from "../atoms/homeRepositoryState";

export default function useAddColumnSpace() {

  const addColumnSpace = useRecoilCallback(({snapshot, set}) => async (columnSpaceName: string) => {

    // カラムスペース追加
    const currentColumnSpaces = await snapshot.getPromise(columnSpacesState)
    const newColumnSpaces = Object.assign(cloneDeep(currentColumnSpaces), {
      [uuidv4()]: {
        "name": columnSpaceName,
        "childColumnSpaces": {},
        "columns": {}
      }
    })
    set(columnSpacesState, newColumnSpaces)

    // ファイル書き出し
    const homeRepository = await snapshot.getPromise(homeRepositoryState)
    homeRepository.saveFile(newColumnSpaces)
  });

  return addColumnSpace;
}