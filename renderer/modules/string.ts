import path from "path";

// 第二引数が第一引数のサブディレクトリならtrue
export const isSubDir = (parent: string, dir: string) => {
  const relative = path.relative(parent, dir);
  const isSubdir = relative && !relative.startsWith('..') && !path.isAbsolute(relative);
  return isSubdir;
}