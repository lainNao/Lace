import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import columnSpacesState from "../atoms/columnSpacesState";
import { moveColumnSpaceUseCase } from "../usecases/moveColumnSpaceUseCase";

export default function useMoveColumnSpace() {

  const moveColumnSpace = useRecoilCallback(({set}) => async (id: string, toId: string) => {
    const newColumnSpaces = await moveColumnSpaceUseCase(id, toId)
    set(columnSpacesState, newColumnSpaces);
  });

  return moveColumnSpace;
}