import { useRecoilCallback, useRecoilState, useRecoilStateLoadable } from "recoil";
import columnSpacesState from "../recoils/atoms/columnSpacesState";
import { useEffect } from "react";
import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";

export default function useSetupColumnSpaces() {

  const [columnSpaces, setColumnSpaces] = useRecoilState(columnSpacesState);

  useEffect(() => {
    (async() => {
      const columnSpacesRepository = new ColumnSpacesRepositoryJson();
      const columnSpaces = await columnSpacesRepository.readOrInitialize()
      setColumnSpaces(columnSpaces)
    })()
  }, [])

  return [columnSpaces, setColumnSpaces] as const;

}