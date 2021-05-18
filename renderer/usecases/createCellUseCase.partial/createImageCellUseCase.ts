import { ColumnSpaces } from "../../models/ColumnSpaces";
import { CreateCellUsecasesArgs } from "../createCellUseCase";

export const createImageCellUseCase = async(args: CreateCellUsecasesArgs): Promise<ColumnSpaces> => {
  console.log(args.cellData)
  throw new Error("未実装です");
  return null;
}