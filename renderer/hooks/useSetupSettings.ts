import { useRecoilCallback, useRecoilState, useRecoilStateLoadable } from "recoil";
import columnSpacesState from "../atoms/columnSpacesState";
import { useEffect, useState } from "react";
import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";

export default function useSetupSettings() {

  const [expandedColumnSpaces, setExpandedColumnSpaces] = useState<string[]>([]);

  useEffect(() => {
    //TODO 無いIDが入ってる可能性を考慮
    const expandedColumnSpaces = localStorage.getItem("expandedColumnSpaces")
    setExpandedColumnSpaces((expandedColumnSpaces) ? JSON.parse(expandedColumnSpaces): [])

  }, [setExpandedColumnSpaces])

  return [expandedColumnSpaces, setExpandedColumnSpaces] as const;

}