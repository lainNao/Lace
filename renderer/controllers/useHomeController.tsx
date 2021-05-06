import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import TreeItem from '@material-ui/lab/TreeItem';
import { makeStyles } from '@material-ui/core/styles';
import { useRecoilCallback, useRecoilState, useRecoilValueLoadable } from 'recoil';
import columnSpacesState from '../atoms/columnSpacesState';
import { FileSystemEnum } from "../enums/app"
import { ColumnSpaces } from '../models/ColumnSpaces';
import { createNewColumnSpaceUseCase } from '../usecases/createNewColumnSpaceUseCase';
import { moveColumnSpaceUseCase } from '../usecases/moveColumnSpaceUseCase';
import { showColumnContextMenu } from '../context-menus/showColumnContextMenu';
import { showColumnSpaceContextMenu } from '../context-menus/showColumnSpaceContextMenu';
import { showEmptySpaceContextMenu } from '../context-menus/showEmptySpaceContextMenu';
import { remote } from "electron"
import useSetupColumnSpaces from '../hooks/useSetupColumnSpaces';
import { removeColumnSpaceUseCase } from '../usecases/removeColumnSpaceUseCase';
import useSetupSettings from '../hooks/useSetupSettings';

const useStyles = makeStyles({
  label: {
    fontSize: "15px"
  },
});

// todo ユースケース達はエラー処理してないのでコントローラ側で例外対策する
// todo テーマとかどうするか

// memo 基本的にコントローラーでカラムスペースを扱う時は、高速化のためにidだけで扱う。別に直接columnSpacesをいじってもいいけどたぶん処理がサービス内とわりと二重になるから…
export const useHomeController = () => {
  const classes = useStyles()
  const newColumnSpaceInputRef = React.useRef(null);
  const [columnSpaces, setColumnSpaces] = useSetupColumnSpaces();
  const [newColumnFormVisible, setNewColumnFormVisible] = useState<boolean>(false);
  const [expandedColumnSpaces, setExpandedColumnSpaces] = useSetupSettings();

  const saveExpandedColumnSpaces = useCallback((expandedNodeIds: string[]) => {
    localStorage.setItem("expandedColumnSpaces", JSON.stringify(expandedNodeIds));
    setExpandedColumnSpaces(expandedNodeIds);
  }, [setExpandedColumnSpaces]);

  // カラムスペースのコンテキストメニュー表示
  const handleRightClickOnColumnSpace = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();

    const targetDataset = (event.target as HTMLElement).parentElement.parentElement.parentElement.dataset;

    showColumnSpaceContextMenu(event, {
      handleClickDeleteColumnSpace: async () => {
        const res = await remote.dialog.showMessageBox({
          type: 'info',
          buttons: ['はい', "いいえ"],
          title: 'カラムスペースの削除',
          message: 'カラムスペースの削除',
          detail: `${targetDataset.name}を削除しますか？`,
        });
        if (res.response === 0) { //「はい」を選択した時
          const newColumnSpaces = await removeColumnSpaceUseCase(targetDataset.id);
          setColumnSpaces(newColumnSpaces);
        }
      }
    });
  }, [columnSpaces]);

  // カラムのコンテキストメニュー表示
  const handleRightClickOnColumn = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    showColumnContextMenu(event);
  }, []);

  // エクスプローラーの無部分押下時のコンテキストメニュー表示
  const handleRightClickOnEmptySpace = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    showEmptySpaceContextMenu(event, {
      handleClickAddColumnSpace: () => {
        setNewColumnFormVisible(true);
        setImmediate(() => {
          newColumnSpaceInputRef.current.focus();
        })
      }
    });
  }, [newColumnSpaceInputRef, setNewColumnFormVisible, showEmptySpaceContextMenu]);

  // カラムスペース追加inputをBlur時に発火
  const handleNewColumnInputOnBlur = useRecoilCallback(({set}) => async (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newColumnSpaceName = event.target.value;
    newColumnSpaceInputRef.current.value = null;
    newColumnSpaceInputRef.current.blur();
    setNewColumnFormVisible(false);

    // 入力値が空なら何も何もしない
    if (newColumnSpaceName === "") {
      return;
    }

    // 新しいカラムスペースを追加
    const newColumnSpaces = await createNewColumnSpaceUseCase(newColumnSpaceName)
    set(columnSpacesState, newColumnSpaces)
  }, [setNewColumnFormVisible]);

  // カラムスペース追加ボタン押下
  const handleClickAddColumnSpaceButton = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    setNewColumnFormVisible(true);
    setImmediate(() => {
      newColumnSpaceInputRef.current.focus();
    })
  }, [newColumnSpaceInputRef, setNewColumnFormVisible]);


  // カラムスペース追加フォームsubmit
  // todo 右クリメニューからの特定カラムスペース配下への追加も対応したい　ただし、ツリーの途中にinputを出す実装つらくなりそう。vscode方式辞めるか………？
  const handleSubmitNewColumnSpaceForm = useRecoilCallback(({set}) => async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewColumnFormVisible(false);
    const newColumnSpaceName: string = (event.currentTarget.elements.namedItem("new-column-space-name") as HTMLInputElement).value;
    (event.currentTarget.elements.namedItem("new-column-space-name") as HTMLInputElement).value = null;

    // 入力値が空なら何も何もしない
    if (newColumnSpaceName === "") {
      newColumnSpaceInputRef.current.blur();
      return;
    }

    // 新しいカラムスペースを追加
    const newColumnSpaces = await createNewColumnSpaceUseCase(newColumnSpaceName)
    set(columnSpacesState, newColumnSpaces)
  }, [setNewColumnFormVisible]);

  // DnDでカラムスペースの移動の管理
  const handleDragStartOnNode = useCallback((event) => {
    event.dataTransfer.setData("fromId", (event.target as HTMLElement).parentElement.parentElement.parentElement.dataset.id)
  }, [])

  // DnDでカラムスペースの移動の管理
  const handleDragOverOnNode = useCallback((event) => {
    event.preventDefault();
  }, [])

  // DnDでカラムスペースの移動の管理
  const handleDropOnNode = useCallback(async(event) => {
    const fromId = event.dataTransfer.getData("fromId");
    const toId = (event.target as HTMLElement).parentElement.parentElement.parentElement.dataset.id

    if (columnSpaces.canMoveDescendantColumnSpace(fromId, toId)) {
      const newColumnSpaces = await moveColumnSpaceUseCase(fromId, toId);
      setColumnSpaces(newColumnSpaces);
      setExpandedColumnSpaces((currentExpanded) => [...currentExpanded, toId]);
    }
  }, [columnSpaces]);

  // ColumnSpacesのツリーをレンダリング
  const generateColumnSpaceElementTree = useCallback((columnSpaces: ColumnSpaces) => {

    return columnSpaces.children.map((columnSpace) => {
      return (
        <TreeItem
          key={columnSpace.id}
          nodeId={columnSpace.id}
          label={
            <div draggable
              onDragStart={handleDragStartOnNode}
              onDragOver={handleDragOverOnNode}
              onDrop={handleDropOnNode}
            >{columnSpace.name}</div>
          }
          onContextMenu={handleRightClickOnColumnSpace}
          data-type={FileSystemEnum.ColumnSpace}
          data-name={columnSpace.name}
          data-id={columnSpace.id}
          data-has-child-column-spaces={!!(columnSpace.canAddChildColumnSpace())}
          data-has-columns={!!(columnSpace.hasColumns())}
          classes={{
            label: classes.label,
          }}
        >
          {columnSpace.canAddChildColumnSpace()
            // カラムスペースを再帰レンダリング
            ? generateColumnSpaceElementTree(columnSpace.childColumnSpaces)
            // 末端をレンダリング（カラムスペース、またはカラム）
            // todo ここだけTreeItemでなくてもよいかもしれない
            : columnSpace.columns.children.map((column) =>
                <TreeItem
                  draggable
                  key={column.id}
                  nodeId={column.id}
                  label={column.name}
                  onContextMenu={handleRightClickOnColumn}
                  onDragStart={handleDragStartOnNode}
                  onDragOver={handleDragOverOnNode}
                  onDrop={handleDropOnNode}
                  TransitionProps={{
                    "timeout": 100         //todo 効いてない…
                  }}
                />
              )
          }
        </TreeItem>
      )
    })
  }, [handleDragStartOnNode, handleDragOverOnNode, handleDropOnNode, handleRightClickOnColumnSpace, handleRightClickOnColumn])

  // D&Dの制御
  // useEffect(() => {

  //   document.ondragover = document.ondrop = (e) => {
  //     e.preventDefault();
  //   }

  //   // いずれdocument.bodyへのドロップじゃないのに変えるべき
  //   // そもそもファイル類追加のときのみDnDを受け入れるようにする
  //   document.body.ondrop = async (e) => {
  //     /*
  //       今はメインのカラムに追加しか対応してないけど、特定のセルの今のカーソル位置に追加とか、子カラムの特定セルに追加とかもできるようにする
  //       ファイルの種類のバリデーションをすること
  //       ローディングスピナーでも出すこと
  //       ファイル名のバリデーションをすること（スラッシュとかいろいろあるとバグるので）
  //       ファイルサイズのバリデーションをすること（あまりにもでかすぎる場合確認取るなど）
  //       同名ファイルは「(2)」とかつけるようにすること
  //       エラー起きたらいい感じに表示すること
  //       ファイルが入ったら、リストアイテムの表示を更新すること
  //       リストアイテムの表示は軽くすること
  //       アップロード完了したらファイルのパスをDBに保存すること（そしてメモリに展開すること）（single truth of source的なものも実現させたいところ…）
  //       そしてリビルドさせること
  //       ひとまずはmainDisplayedColumnにアップロードさせるが、後で他カラムに使うファイルのアップロードにも対応させること
  //       ひとまずメモリ上でjson型のDBを作り、定期保存かつ、windowが閉じられた時に保存するような仕様にする
  //       asyncだと後々難しい場合、syncで全部やるのも考える
  //     */
  //     const droppedFileList = e.dataTransfer.files;
  //     if (!droppedFileList.length) {
  //       return;
  //     }
  //     let newColumnSpaceDB: columnSpacesType;

  //     for (let i=0; i<droppedFileList.length; i++) {
  //       //トランザクションとか考慮？
  //       newColumnSpaceDB = await this.repository.uploadFile(droppedFileList[i], currentMainDisplayedColumnUUID);
  //     }

  //     console.log('ファイル取り込み完了');

  //     setColumnSpaces(newColumnSpaceDB);
  //   }
  // }, [columnSpaceDB])

  return {
    //データ
    columnSpaces,
    newColumnFormVisible,
    expandedColumnSpaces,
    //関数
    generateColumnSpaceElementTree,
    saveExpandedColumnSpaces,
    //イベントハンドラ
    handleClickAddColumnSpaceButton,
    handleRightClickOnEmptySpace,
    handleSubmitNewColumnSpaceForm,
    handleNewColumnInputOnBlur,
    //他
    newColumnSpaceInputRef,
  }
}