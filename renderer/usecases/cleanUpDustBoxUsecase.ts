import { getSaveDirPath } from "../modules/ipc";
import glob from "glob-promise";
import path from "path";
import fs from "fs";
import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";

export const cleanUpDustBoxUsecase = async(): Promise<string[]> => {

  // file_datas_dust_box配下のファイルのフルパスを全部取得する
  const saveDirPath = await getSaveDirPath();
  if (!saveDirPath) {
    throw new Error("saveDirPathが空です");
  }
  const dustBoxDirFullPath = path.join(saveDirPath, ColumnSpacesRepositoryJson.dustBoxDir);
  const dustedFilesReg = path.join(dustBoxDirFullPath,"**","*.*");
  const dustedFilesFullPaths = await glob(dustedFilesReg);

  // それと、それに対応するfile_datas配下のファイルを削除していく
  for (const dustedFileFullPath of dustedFilesFullPaths) {
    const relPath = path.relative(dustBoxDirFullPath, dustedFileFullPath);
    await fs.promises.unlink(path.join(saveDirPath, ColumnSpacesRepositoryJson.dustBoxDir, relPath));
    await fs.promises.unlink(path.join(saveDirPath, ColumnSpacesRepositoryJson.columnDataDir, relPath))
  }

  // TODO file_datas配下とfile_datas_dust_box配下両方で空になっている「カラムスペースID/カラムID」のディレクトリは削除する。両方で空でないと駄目

  return dustedFilesFullPaths;

}
