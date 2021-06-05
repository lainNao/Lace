import copydir from "copy-dir";

export const updateDbPathUsecase = async(oldUserDirectory: string, newUserDirectory: string): Promise<void> => {

  // フォルダをコピー
  await copydir(oldUserDirectory, newUserDirectory, {
    utimes: true,  // keep add time and modify time
    mode: true,    // keep file mode
  });

}
