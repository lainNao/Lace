import { CreateCellUsecasesArgs } from "../createCellUseCase";

export const createTextCellUseCase = async(args: CreateCellUsecasesArgs) => {
  console.log("呼ばれた", args);
  return "TODO";
}
