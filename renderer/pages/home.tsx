import React, { useState, useEffect, Dispatch } from 'react';
import { IconButton } from "@chakra-ui/react"
import { SearchIcon, EditIcon, AddIcon } from "@chakra-ui/icons"
import { ContextMenuTargetType } from "../enums/app"
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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

  if (controller.columnSpaces == null) {
    return (
      <div>DB読込中</div>
    )
  }

  // const currentMainColumnDatas = columnSpaces[props.currentColumnSpaceId].columns[props.currentMainColumnId].datas;

  return (
    <div className="flex flex-col h-screen">
      <div className="header">
        head（自由検索、各種設定、ヘルプ、リンクなど）
      </div>
      <div className="content flex flex-row w-screen max-h-full ">

        <div className="flex flex-col items-center overflow-y-auto p-3 space-y-2.5">
          <IconButton aria-label="search" icon={<SearchIcon />} />
          <IconButton aria-label="edit" icon={<EditIcon />} />
        </div>

        <div className="min-w-300px overflow-y-auto p-3" onContextMenu={(event) => controller.handleRightClickOnTree(event, {targetType: ContextMenuTargetType.EmptySpace})}>
          <div>
            <span >カラムスペース</span>
            <IconButton className="ml-3" aria-label="add" icon={<AddIcon />} onClick={ (event) => {
              controller.handleClickColumnSpaceAddButton(event, "121212dfdfd12")
            }}/>
          </div>
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            className="select-none"
            >
            {controller.generateColumnSpaceElementTree(controller.columnSpaces)}
          </TreeView>
        </div>

        <div className="min-w-300px overflow-y-auto p-3">
        <Modal
          open={controller.isOpeningModal}
          onClose={controller.handleCloseModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className={controller.classes.paper}>
            {controller.modalContent}
          </div>
        </Modal>

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

      <Menu
        keepMounted
        open={controller.contextMenuState.mouseY !== null}
        onClose={controller.handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          controller.contextMenuState.mouseY !== null && controller.contextMenuState.mouseX !== null
            ? { top: controller.contextMenuState.mouseY, left: controller.contextMenuState.mouseX }
            : undefined
        }
      >
        {controller.contextMenuState.targetType === ContextMenuTargetType.EmptySpace &&
          [
            <MenuItem onClick={controller.handleCloseContextMenu}>なにもないところを右クリ</MenuItem>
          ]
        }
        {controller.contextMenuState.targetType === ContextMenuTargetType.Directory &&
          [
            <MenuItem key="表示" onClick={controller.handleCloseContextMenu}>表示</MenuItem>,
            <MenuItem key="フォルダ追加" onClick={controller.handleCloseContextMenu}>フォルダ追加</MenuItem>,
            <MenuItem key="削除" onClick={controller.handleCloseContextMenu}>削除</MenuItem>,
            <MenuItem key="リネーム" onClick={controller.handleCloseContextMenu}>リネーム</MenuItem>,
          ]
        }
        {controller.contextMenuState.targetType === ContextMenuTargetType.Column &&
          [
            <MenuItem onClick={controller.handleCloseContextMenu}>あああ</MenuItem>
          ]
        }
      </Menu>



    </div>
  )

}

export default Home;
