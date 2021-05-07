import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import TreeItem from '@material-ui/lab/TreeItem';
import { makeStyles } from '@material-ui/core/styles';
import { useRecoilCallback, useRecoilState, useRecoilValueLoadable } from 'recoil';
import columnSpacesState from '../atoms/columnSpacesState';
import { FileSystemEnum } from "../enums/app"
import { ColumnSpaces } from '../models/ColumnSpaces';
import { createColumnSpaceUseCase } from '../usecases/createColumnSpaceUseCase';
import { moveColumnSpaceUseCase } from '../usecases/moveColumnSpaceUseCase';
import { showColumnContextMenu } from '../context-menus/showColumnContextMenu';
import { showColumnSpaceContextMenu } from '../context-menus/showColumnSpaceContextMenu';
import { showEmptySpaceContextMenu } from '../context-menus/showEmptySpaceContextMenu';
import { remote } from "electron"
import useSetupColumnSpaces from '../hooks/useSetupColumnSpaces';
import { removeColumnSpaceUseCase } from '../usecases/removeColumnSpaceUseCase';
import useSetupSettings from '../hooks/useSetupSettings';
import { createDescendantColumnSpaceUseCase } from '../usecases/createDescendantColumnSpaceUseCase';

const useStyles = makeStyles({
  label: {
    fontSize: "15px"
  },
});

// todo ユースケース達はエラー処理してないのでコントローラ側で例外対策する
// todo テーマとかどうするか

// memo 基本的にコントローラーでカラムスペースを扱う時は、高速化のためにidだけで扱う。別に直接columnSpacesをいじってもいいけどたぶん処理がサービス内とわりと二重になるから…
export const useHomeController = () => {
  // メタ状態類
  const [columnSpaces, setColumnSpaces] = useSetupColumnSpaces();
  // UI状態類
  const [expandedColumnSpaces, setExpandedColumnSpaces] = useSetupSettings();
  const [selectedNodeId, setSelectedNodeId] = useState<string>(null);
  const classes = useStyles()
  // ref
  const newTopLevelColumnSpaceFormRef = React.useRef(null);
  const newColumnSpacesFormRefs = React.useRef([]);

  // カラムスペースのコンテキストメニュー表示
  const handleRightClickOnColumnSpace = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();

    const targetDataset = (event.target as HTMLElement).parentElement.parentElement.parentElement.dataset;
    setSelectedNodeId(targetDataset.id);

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
      },
      handleClickAddChildColumnSpace: async () => {
        newColumnSpacesFormRefs.current[targetDataset.id].classList.remove("hidden");
        newColumnSpacesFormRefs.current[targetDataset.id].elements.namedItem("new-column-space-name").focus();
      },
      handleClickAddChildColumn: async () => {
        //todo 子カラム追加。ここそもそもカラム追加時のカラムタイプの選択とかいろいろあってまた強め作業になる
        console.log("子カラム追加処理");
        // const newColumnSpaces = await createColumnUseCase(targetDataset.id);
        // setColumnSpaces(newColumnSpaces);

      },
      targetColumnSpaceDataset: targetDataset,
    });
  }, [columnSpaces]);

  // カラムのコンテキストメニュー表示
  const handleRightClickOnColumn = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedNodeId((event.target as HTMLElement).parentElement.parentElement.dataset.id);
    showColumnContextMenu(event);
  }, []);

  // エクスプローラーの無部分押下時のコンテキストメニュー表示
  const handleRightClickOnEmptySpace = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    showEmptySpaceContextMenu(event, {
      handleClickAddColumnSpace: () => {
        newTopLevelColumnSpaceFormRef.current.elements.namedItem("new-column-space-name").classList.add("hidden");

        newTopLevelColumnSpaceFormRef.current.classList.remove("hidden");
        setImmediate(() => {
          newTopLevelColumnSpaceFormRef.current.elements.namedItem("new-column-space-name").focus();
        });
      }
    });
  }, [showEmptySpaceContextMenu]);

  // カラムスペース追加inputをBlur時に発火
  const handleTopLevelNewColumnInputOnBlur = useRecoilCallback(({set}) => async (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newColumnSpaceName = event.target.value;
    newTopLevelColumnSpaceFormRef.current.elements.namedItem("new-column-space-name").value = null;
    newTopLevelColumnSpaceFormRef.current.elements.namedItem("new-column-space-name").blur();
    newTopLevelColumnSpaceFormRef.current.classList.add("hidden");

    // 入力値が空なら何も何もしない
    if (newColumnSpaceName === "") {
      return;
    }

    // 新しいカラムスペースを追加
    const newColumnSpaces = await createColumnSpaceUseCase(newColumnSpaceName)
    set(columnSpacesState, newColumnSpaces)
  }, []);

  // カラムスペース追加ボタン押下
  const handleClickAddColumnSpaceButton = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    newTopLevelColumnSpaceFormRef.current.classList.remove("hidden");
    setImmediate(() => {
      newTopLevelColumnSpaceFormRef.current.elements.namedItem("new-column-space-name").focus();
    })
  }, []);

  // カラムスペース追加フォームsubmit
  // todo 右クリメニューからの特定カラムスペース配下への追加も対応したい　ただし、ツリーの途中にinputを出す実装つらくなりそう。vscode方式辞めるか………？
  const handleSubmitTopLevelNewColumnSpaceForm = useRecoilCallback(({set}) => async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    newTopLevelColumnSpaceFormRef.current.classList.add("hidden");
    const newColumnSpaceName: string = (event.currentTarget.elements.namedItem("new-column-space-name") as HTMLInputElement).value;
    (event.currentTarget.elements.namedItem("new-column-space-name") as HTMLInputElement).value = null;

    // 入力値が空なら何も何もしない
    if (newColumnSpaceName === "") {
      newTopLevelColumnSpaceFormRef.current.elements.namedItem("new-column-space-name").blur();
      return;
    }

    // 新しいカラムスペースを追加
    const newColumnSpaces = await createColumnSpaceUseCase(newColumnSpaceName)
    set(columnSpacesState, newColumnSpaces)
  }, []);

    // カラムスペース追加フォームsubmit
  // todo 右クリメニューからの特定カラムスペース配下への追加も対応したい　ただし、ツリーの途中にinputを出す実装つらくなりそう。vscode方式辞めるか………？
  const handleSubmitNewColumnSpaceForm = useRecoilCallback(({set}) => async (event: React.FormEvent<HTMLFormElement>, columnSpaceId: string) => {
    event.preventDefault();

    const nodeId = columnSpaceId;
    const inputElem = newColumnSpacesFormRefs.current[nodeId].elements.namedItem("new-column-space-name");
    const newColumnSpaceName = inputElem.value;

    newColumnSpacesFormRefs.current[columnSpaceId].classList.add("hidden");
    inputElem.value = null;
    inputElem.blur();

    // 入力値が空なら何も何もしない
    if (newColumnSpaceName === "") {
      newTopLevelColumnSpaceFormRef.current.elements.namedItem("new-column-space-name").blur();
      return;
    }

    // 指定IDのカラムスペースの子に新しいカラムスペースを追加
    const newColumnSpaces = await createDescendantColumnSpaceUseCase(nodeId, newColumnSpaceName);
    set(columnSpacesState, newColumnSpaces);
    setExpandedColumnSpaces((currentExpanded) => [...currentExpanded, nodeId]);
  }, []);

    // カラムスペース追加inputをBlur時に発火
  const handleNewColumnInputOnBlur = useRecoilCallback(({set}) => async (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault();

    const newColumnSpaceName = event.target.value;
    const nodeId = event.target.parentElement.dataset.id;
    const inputElem = newColumnSpacesFormRefs.current[nodeId].elements.namedItem("new-column-space-name");

    newColumnSpacesFormRefs.current[nodeId].classList.add("hidden");
    inputElem.value = null;
    inputElem.blur();

    // 入力値が空なら何も何もしない
    if (newColumnSpaceName === "") {
      return;
    }

    // 指定IDのカラムスペースの子に新しいカラムスペースを追加
    const newColumnSpaces = await createDescendantColumnSpaceUseCase(nodeId, newColumnSpaceName);
    set(columnSpacesState, newColumnSpaces);
    setExpandedColumnSpaces((currentExpanded) => [...currentExpanded, nodeId]);
  }, []);


  // ツリービュー展開のトグル
  const handleTreeNodeToggle = useCallback((event, expandedNodeIds) => {
    localStorage.setItem("expandedColumnSpaces", JSON.stringify(expandedNodeIds));
    setExpandedColumnSpaces(expandedNodeIds);
  }, []);

  // DnDでカラムスペースの移動の管理
  const handleDragStartOnNode = useCallback((event) => {
    event.dataTransfer.setData("fromId", (event.target as HTMLElement).parentElement.parentElement.parentElement.dataset.id)
  }, []);

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
        <>
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
            TransitionProps={{
              "timeout": 0
            }}
          >
            {columnSpace.canAddChildColumnSpace()
              // カラムスペースを再帰レンダリング
              ? generateColumnSpaceElementTree(columnSpace.childColumnSpaces)
              // 末端（カラム）をレンダリング
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
                    data-type={FileSystemEnum.Column}
                    data-name={column.name}
                    data-id={column.id}
                    //todo collapsableとかcellsとかのあれこれの値も入れて使う時もあるかもなのでその時考慮して追加も考える
                  />
                )
            }
          </TreeItem>
          <form className="ml-9 hidden" data-id={columnSpace.id} onSubmit={event => {handleSubmitNewColumnSpaceForm(event, columnSpace.id)}} ref={elem => newColumnSpacesFormRefs.current[columnSpace.id] = elem}>
            <input name="new-column-space-name" className="bg-gray-700" spellCheck={false} onBlur={handleNewColumnInputOnBlur}></input>
          </form>
        </>
      )
    })
  }, [handleDragStartOnNode, handleDragOverOnNode, handleDropOnNode, handleRightClickOnColumnSpace, handleRightClickOnColumn, handleNewColumnInputOnBlur])

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
    expandedColumnSpaces,
    selectedNodeId,
    //関数
    generateColumnSpaceElementTree,
    //イベントハンドラ
    handleClickAddColumnSpaceButton,
    handleRightClickOnEmptySpace,
    handleSubmitTopLevelNewColumnSpaceForm,
    handleTopLevelNewColumnInputOnBlur,
    handleTreeNodeToggle,
    //他
    newTopLevelColumnSpaceFormRef,
  }
}