import { ColumnSpaces } from "../../models/ColumnSpaces";
import { CreateCellsUsecasesArgs } from "../createCellsUseCase";

export const createTextCellsUseCase = async(args: CreateCellsUsecasesArgs): Promise<ColumnSpaces> => {
  console.log(args)
  throw new Error("未実装です");
  return null;
}