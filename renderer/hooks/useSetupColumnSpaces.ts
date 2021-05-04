import { useRecoilCallback, useRecoilState } from "recoil";
import columnSpacesState from "../atoms/columnSpacesState";
import { useEffect } from "react";
import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";

export default function useSetupColumnSpaces() {

  const [columnSpaces, setColumnSpaces] = useRecoilState(columnSpacesState);

  useEffect(() => {
    const columnSpacesRepository = new ColumnSpacesRepositoryJson();
    const columnSpaces = columnSpacesRepository.readOrCreateDB()
    setColumnSpaces(columnSpaces)
  }, [setColumnSpaces])

  return columnSpaces;

}