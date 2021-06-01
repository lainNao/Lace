import React from 'react';
import { IconButton } from "@chakra-ui/react"
import { SearchIcon, EditIcon, AddIcon } from "@chakra-ui/icons"
import { useHomeController } from '../controllers/home/useHomeController';
import { ColumnSpaceExplorer } from "../pages.partial/home/ColumnSpaceExplorer";
import Link from 'next/link';
import { remote } from 'electron';
import { CogIcon, HomeIcon } from '../components/icons';

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
const Settings: React.FC = () => {

  const controller = useHomeController();
  // const currentMainDisplayedColumnUUID = "C23456789-C234-C234-C234-C23456789123"  //仮のモック
  // const currentColumnSpaceUUID = "123456789-1234-1234-1234-123456789123"; //仮のモック（これ今は半無限の深さになったので、道筋のUUIDの配列にするのがいいかも）
  // const currentMainColumnDatas = columnSpaces[props.currentColumnSpaceId].columns[props.currentMainColumnId].datas;

  if (!controller.isInitializeFinished) {
    return (
      <div>読込中</div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* メニューバー */}
      <div className="menu-bar bg-gray-900  flex justify-between">
        {/* メニュー */}
        <div className="flex">
          <div className="hover:bg-gray-700 grid place-items-center w-14 text-gray-300">File</div>
          <div className="hover:bg-gray-700 grid place-items-center w-14 text-gray-300">Help</div>
        </div>
        <div className="webkit-app-region-drag flex-auto"></div>

        {/* 各種ボタン */}
        <div className="flex">
          <div className="hover:bg-gray-700 grid place-items-center w-14 text-gray-300" onClick={() => remote.getCurrentWindow().minimize()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </div>
          <div className="hover:bg-gray-700 grid place-items-center w-14 text-gray-300" style={{fill:"white"}} onClick={() => {
            const window = remote.getCurrentWindow();
            if (!window.isMaximized()) {
              window.maximize();
            } else {
              window.unmaximize();
            }
          }}>
            <svg height="18px" viewBox="0 -43 512 512" width="18px" xmlns="http://www.w3.org/2000/svg"><path d="m368 341.332031h-224c-32.363281 0-58.667969-26.300781-58.667969-58.664062v-138.667969c0-32.363281 26.304688-58.667969 58.667969-58.667969h224c32.363281 0 58.667969 26.304688 58.667969 58.667969v138.667969c0 32.363281-26.304688 58.664062-58.667969 58.664062zm-224-224c-14.699219 0-26.667969 11.96875-26.667969 26.667969v138.667969c0 14.699219 11.96875 26.664062 26.667969 26.664062h224c14.699219 0 26.667969-11.964843 26.667969-26.664062v-138.667969c0-14.699219-11.96875-26.667969-26.667969-26.667969zm0 0"/><path d="m16 170.667969c-8.832031 0-16-7.167969-16-16v-96c0-32.363281 26.304688-58.667969 58.667969-58.667969h96c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16h-96c-14.699219 0-26.667969 11.96875-26.667969 26.667969v96c0 8.832031-7.167969 16-16 16zm0 0"/><path d="m496 170.667969c-8.832031 0-16-7.167969-16-16v-96c0-14.699219-11.96875-26.667969-26.667969-26.667969h-96c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h96c32.363281 0 58.667969 26.304688 58.667969 58.667969v96c0 8.832031-7.167969 16-16 16zm0 0"/><path d="m453.332031 426.667969h-96c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h96c14.699219 0 26.667969-11.96875 26.667969-26.667969v-96c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v96c0 32.363281-26.304688 58.667969-58.667969 58.667969zm0 0"/><path d="m154.667969 426.667969h-96c-32.363281 0-58.667969-26.304688-58.667969-58.667969v-96c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v96c0 14.699219 11.96875 26.667969 26.667969 26.667969h96c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"/></svg>
          </div>
          <div className="hover:bg-red-600 grid place-items-center w-14 text-gray-300" onClick={() => remote.getCurrentWindow().close()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div className="content flex flex-row w-screen max-h-full ">

        {/* 一番左の部分 */}
        <div className="flex flex-col items-center p-2 space-y-2.5">
          <Link href="/home"><IconButton aria-label="search" icon={<HomeIcon className="" />} /></Link>
          <Link href="/settings"><IconButton aria-label="edit" icon={<CogIcon className="text-blue-400" />}/></Link>
        </div>

        {/* メイン表示 */}
        <div className="min-w-300px w-full bg-gray-900 overflow-y-auto p-3">
            asdf
        </div>
      </div>

      {/* フッター */}
      <div className="footer">
        foot（状態表示など）
      </div>

    </div>
  )

}

export default Settings;
