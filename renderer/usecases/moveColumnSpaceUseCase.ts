import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";

export const moveColumnSpaceUseCase = async(id: string, toId: string): Promise<ColumnSpaces> => {

  const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  const rootColumnSpaces = await columnSpacesRepository.read();
  if (!rootColumnSpaces.canMoveDescendantColumnSpace(id, toId)) {
    throw new Error("移動できません");
  }

  const newRootColumnSpaces = rootColumnSpaces.moveDescendantColumnSpace(id, toId)
  await columnSpacesRepository.save(newRootColumnSpaces);
  return newRootColumnSpaces;

}
