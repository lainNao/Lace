import React, { useState, useEffect, Dispatch } from 'react';
import { IconButton } from "@chakra-ui/react"
import { SearchIcon, EditIcon, AddIcon } from "@chakra-ui/icons"
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Modal from '@material-ui/core/Modal';
import { useHomeController } from '../controllers/useHomeController';

/*
  絶対パスでimportできるようにする
*/

/*
ファイルアップロードする前にはカラムスペースとカラムのUUIDのフォルダが必要なのでそれ作成しておくように実装を修正する
	無い場合は作る感じでいい気がする
	というかそもそもファイルが必要とするカラムを作成した時点で作る感じでいいかな（↑で無い場合はこれを呼ぶなど）
*/

const Home: React.FC = () => {

  const controller = useHomeController();
  const currentMainDisplayedColumnUUID = "C23456789-C234-C234-C234-C23456789123"  //仮のモック
  const currentColumnSpaceUUID = "123456789-1234-1234-1234-123456789123"; //仮のモック（これ今は半無限の深さになったので、道筋のUUIDの配列にするのがいいかも）
  // const currentMainColumnDatas = columnSpaces[props.currentColumnSpaceId].columns[props.currentMainColumnId].datas;

  if (controller.columnSpaces.state === "loading"){
    return (
      <div>DB読込中</div>
    )
  }

  if (controller.columnSpaces.state === "hasError") {
    return (
      <div>DB読み込みエラー</div>
    )
  }

  if (controller.columnSpaces.state === "hasValue" && !controller.columnSpaces.contents) {
    return (
      <div>ロード中</div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="header bg-gray-900 webkit-app-region-drag">
        メニューをvscodeみたいに自前で作る。electronにやらせると微妙になるので。コンテキストメニューも自前で。
      </div>
      <div>
        head（自由検索、各種設定、ヘルプ、リンクなど）
      </div>
      <div className="content flex flex-row w-screen max-h-full ">

        <div className="flex flex-col items-center p-3 space-y-2.5">
          <IconButton aria-label="search" icon={<SearchIcon />} />
          <IconButton aria-label="edit" icon={<EditIcon />} />
        </div>

        <div className="min-w-300px overflow-y-auto p-3" onContextMenu={controller.handleRightClickOnEmptySpace}>
          <div>
            <span >カラムスペース</span>
            <IconButton className="ml-3" aria-label="add" icon={<AddIcon />} onClick={ (event) => {
              //todo 名前は自分で決めるようにする
              controller.handleClickAddColumnSpaceButton(event, "121212dfdfd12")
            }}/>
          </div>
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            className="select-none"
          >
            {controller.generateColumnSpaceElementTree(controller.columnSpaces.contents)}
          </TreeView>
        </div>

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
