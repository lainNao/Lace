import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import columnSpacesState from "../atoms/columnSpacesState";
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep } from "lodash";

/*
  ここ、実装がかなり不安定なので余裕あれば直す
  バグる確率はかなり低いけどバグりうるような気がする
*/

function findAllByKey(obj, keyToFind) {
  return Object.entries(obj)
    .reduce((acc, [key, value]) =>
      (key === keyToFind)
        ? acc.concat(value)
        : (typeof value === 'object')
          ? acc.concat(findAllByKey(value, keyToFind))
          : acc
    , [])
}

function removeProp(obj, propName) {
  for (let p in obj) {
    if (obj.hasOwnProperty(p)) {
      if (p == propName) {
        delete obj[p];
      } else if (typeof obj[p] == 'object') {
        removeProp(obj[p], propName);
      }
    }
  }
  return obj;
}

function addProp(obj, propName, keyData, keyName) {
  for (let p in obj) {
    if (obj.hasOwnProperty(p)) {
      if (p == propName) {
        obj[p].childColumnSpaces[keyName] = keyData;
      } else if (typeof obj[p] == 'object') {
        addProp(obj[p], propName, keyData, keyName);
      }
    }
  }
  return obj;
}

export default function useMoveColumnSpace() {

  const moveColumnSpace = useRecoilCallback(({snapshot, set}) => async (meUUID: string, toUUID: string) => {

    // /* カラムスペース追加（コード汚いのでどうにかする） */
    // const currentColumnSpaces = await snapshot.getPromise(columnSpacesState)
    // //指定UUID配下のデータを全部切り取る
    // let separated = cloneDeep(currentColumnSpaces);
    // removeProp(separated, meUUID);
    // const cuttedColumnSpace = findAllByKey(cloneDeep(currentColumnSpaces), meUUID)[0];
    // //指定UUIDのchildColumnSpacesに生やす
    // addProp(separated, toUUID, cuttedColumnSpace, meUUID)
    // //保存する
    // set(columnSpacesState, separated)

    // // ファイル書き出し
    // const homeRepository = await snapshot.getPromise(homeRepositoryState)
    // homeRepository.saveFile(separated)
  });

  return moveColumnSpace;
}