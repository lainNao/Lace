import { useRecoilCallback } from "recoil";
import columnSpacesState from "../atoms/columnSpacesState";
import homeRepositoryState from "../atoms/homeRepositoryState";
import { useEffect } from "react";

export default function useSetupColumnSpaces() {
  const readOrCreateDB = useRecoilCallback(({snapshot, set}) => async () => {
    const homeRepository = await snapshot.getPromise(homeRepositoryState)
    set(columnSpacesState, await homeRepository.readOrCreateDB())
  });

  useEffect(() => {
    readOrCreateDB();
  },[])
}