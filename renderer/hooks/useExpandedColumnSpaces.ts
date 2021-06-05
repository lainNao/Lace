import { useEffect, useState } from "react";
import { LocalStorageKeys } from "../resources/enums/app";

export default function useExpandedColumnSpaces() {

  const [expandedColumnSpaces, setExpandedColumnSpaces] = useState<string[]>([]);

  /// 起動時にlocalStorageから読み込み
  useEffect(() => {
    //TODO カラム削除のたびにいちいちこっちを調整してるわけではないので、無いIDが入ってる蓋然性があるので、起動時に現存するカラムスペース達とつき合わせて削除したい。全部存在するカラムスペースかを突き合わせるの、そんなに処理時間かからないと思う、大量に作らない限り。セルじゃないし。
    //TODO またはクリーンアップ的な処理を作ってメニューバーから実行させる（いやそれは嫌だな）。

    const expandedColumnSpaces = localStorage.getItem("expandedColumnSpaces")
    setExpandedColumnSpaces((expandedColumnSpaces) ? JSON.parse(expandedColumnSpaces): [])
  }, []);

  useEffect(() => {
    localStorage.setItem(LocalStorageKeys.EXPANDED_COLUMN_SPACES, JSON.stringify(expandedColumnSpaces));
  }, [expandedColumnSpaces]);

  return [expandedColumnSpaces, setExpandedColumnSpaces] as const;

}