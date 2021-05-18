import React from 'react';
import { IconButton } from "@chakra-ui/react"
import { SearchIcon, EditIcon, AddIcon } from "@chakra-ui/icons"
import { useHomeController } from '../controllers/home/useHomeController';
import { ColumnSpaceExplorer } from "../pages.partial/home/ColumnSpaceExplorer";

/*
ファイルアップロードする前にはカラムスペースとカラムのUUIDのフォルダが必要なのでそれ作成しておくように実装を修正する
	無い場合は作る感じでいい気がする
	というかそもそもファイルが必要とするカラムを作成した時点で作る感じでいいかな（↑で無い場合はこれを呼ぶなど）
*/
// TODO 絶対パスでimportできるようにする
// TODO ツリーの表示がもっさりしてるから別のライブラリに切り替えるか、または今のツリーのオプションを探す
// TODO カラムスペース追加インプットの見た目
// TODO カラムスペース追加時に一瞬ガクっとなる（高さが限界を超える場合）のをいつか直す
// TODO 一番左のペインのボタン押下で表示する内容を切り替える
const Home: React.FC = () => {

  const controller = useHomeController();
  // const currentMainDisplayedColumnUUID = "C23456789-C234-C234-C234-C23456789123"  //仮のモック
  // const currentColumnSpaceUUID = "123456789-1234-1234-1234-123456789123"; //仮のモック（これ今は半無限の深さになったので、道筋のUUIDの配列にするのがいいかも）
  // const currentMainColumnDatas = columnSpaces[props.currentColumnSpaceId].columns[props.currentMainColumnId].datas;

  if (!controller.columnSpaces) {
    return (
      <div>読込中</div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="menu-bar bg-gray-900 webkit-app-region-drag">
        メニューをvscodeみたいに自前で作る。electronにやらせると微妙になるので。コンテキストメニューも自前で。
      </div>
      <div className="header">
        head（自由検索、各種設定、ヘルプ、リンクなど）
      </div>
      <div className="content flex flex-row w-screen max-h-full ">

        <div className="flex flex-col items-center p-3 space-y-2.5">
          <IconButton aria-label="search" icon={<SearchIcon />} />
          <IconButton aria-label="edit" icon={<EditIcon />} />
        </div>

        <ColumnSpaceExplorer
          classeName="min-w-300px w-300px bg-gray-800 whitespace-pre overflow-y-auto p-3"
        />

        <div className="min-w-300px overflow-y-auto p-3">
          {/* {Object.keys(currentMainColumnDatas).map((dataUUID,index) => {
            const data = currentMainColumnDatas[dataUUID];
            return (
              <div key={`${data.name}-${index}`}>
                <div><img src={data.path} /></div>
                <div>{data.name}</div>
              </div>
            )
          })} */}
        </div>

        <div className=" min-w-300px overflow-y-auto p-3">
          セルの詳細の表示
        </div>

      </div>

      <div className="footer">
        foot（状態表示など）
      </div>

    </div>
  )

}

export default Home;
