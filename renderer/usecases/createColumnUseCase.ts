import { ColumnSpacesRepositoryJson } from "../repositories/ColumnSpacesRepositoryJson";
import { ColumnSpaces } from "../models/ColumnSpaces";
import { TrimedFilledString } from "../value-objects/TrimedFilledString";

// id: string;
// name: string
// type: any; //TODO(enum)
// collapsable: any; //TODO(bool)
// cells: Cells; //TODO

/*
  名前、バリューオブジェクト化してもいいと思う　でもそうするとtojsonの時にちゃんと動くのかわからない（動かすように少し変える必要あると思う）　がんばって…
      いやたぶんこれ、フィールドをvalueにして、toJSONを「this.value」とかにすれば完了だわ。fromJSONやコンストラクタは関係してるモデル達に影響与えるから直すかも
  先にバリューオブジェクトに変更して保存とかあれこれに成功してからカラム作る処理作ったほうがいいと思う
  というか↑にある通りモデルの時点でtodoが複数あるから、それを全部整えるか　それと同じ作業になるわ

*/

export const createColumnUseCase = async(name: TrimedFilledString, toId: string, columnType: any): Promise<ColumnSpaces> => { //todo このcolumnType、enumになるはず

  console.log("実装して")

  return
  // const columnSpacesRepository = new ColumnSpacesRepositoryJson();
  // const rootColumnSpaces = await columnSpacesRepository.read();
  // const newRootColumnSpaces = rootColumnSpaces.moveDescendantColumnSpace(id, toId)
  // await columnSpacesRepository.save(newRootColumnSpaces);
  // return newRootColumnSpaces;
}
