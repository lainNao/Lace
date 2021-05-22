import { useRecoilState } from "recoil";
import relatedCellsState from "../recoils/atoms/relatedCellsState";
import { useEffect } from "react";
import { RelatedCellsRepositoryJson } from "../repositories/RelatedCellsRepositoryJson";

export default function useSetupColumnSpaces() {

  const [relatedCells, setRelatedCells] = useRecoilState(relatedCellsState);

  useEffect(() => {
    (async() => {
      const relatedCellsRepository = new RelatedCellsRepositoryJson();
      const relatedCells = await relatedCellsRepository.read();
      setRelatedCells(relatedCells)
    })()
  }, []);

  return [relatedCells, setRelatedCells] as const;

}