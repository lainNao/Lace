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

enum DirectoryDraggingState {
  Releasing,
  Downed,
  Dragging,
}

interface targetElementDatasets {
  type: string,
  name: string,
  uuid: string,
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "gray",
    textColor: "white",
    outline: "none",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

// todo ユースケース達はエラー処理してないのでコントローラ側で例外対策する
export const useHomeController = () => {
  const [columnSpaces, setColumnSpaces] = useSetupColumnSpaces();
  const [directoryDraggingState, setDirectoryDraggingState] = useState(DirectoryDraggingState.Releasing);
  const [draggingTargetInfo, setDraggingTargetInfo] = useState<targetElementDatasets>(null);
  const [newColumnFormVisible, setNewColumnFormVisible] = useState<boolean>(false);
  const classes = useStyles();
  const newColumnSpaceInputRef = React.useRef(null);

  // カラムスペースのコンテキストメニュー表示
  const handleRightClickOnColumnSpace = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    showColumnSpaceContextMenu(event);
  }, []);

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
  const handleNewColumnInputOnBlur =  useRecoilCallback(({set}) => async (event: React.FocusEvent<HTMLInputElement>) => {
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
  // todo 右クリメニューからの特定カラムスペース配下への追加も対応したい
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

  /// 以下ディレクトリを別ディレクトリにドロップする関連の処理
  /// ドロップしている要素の名前をマウスの右下に出すこと、別ディレクトリにドロップ中にされてる側の背景色が変わること（できれば）、ドロップした後に確認モーダルで決定したら移動されること
  /// ディレクトリをドロップで移動したらファイルも移動になるのでどうしよう。UUIDのみのフォルダに統一できるなら移動する必要ないけどその場合は親子関係をなんらかの値で表現して読み取る必要ある。
  /// そもそもディレクトリ構造にカラムスペースのフォルダは不要なのでは。カラムのみでいい。それならいくらでも移動できる。多分この考えでいける。となるとディレクトリ構造変えるのも対応する必要あり。まずリポジトリ内のソース変更してそこ対応してしまおう、その後にいろいろやろう。でも親子構造をどうデータに反映するかな。
  const handleMouseDownOnDirectory = useCallback((event) => {

    const onMouseUpFromDirectoryDragging = async (innerEvent) => {
      //todo これ、データセットのまま扱ってもいいけどドメインモデルで扱ったほうが判定処理とか共通化できるはず
      const droppedElementDataset = innerEvent.toElement.parentElement.parentElement.dataset;
      const dropElementDatase = event.target.parentElement.parentElement.dataset;
      const areBothDirectory: boolean = (droppedElementDataset.type == FileSystemEnum.ColumnSpace.valueOf())
      const areBothDifferent: boolean = (droppedElementDataset.uuid !== dropElementDatase.uuid)
      const isDroppedHasNoColumnsOrChildColumnSpaces = (droppedElementDataset.hasChildColumnSpaces === "false" && droppedElementDataset.hasColumns === "false")
      if (areBothDirectory && areBothDifferent && isDroppedHasNoColumnsOrChildColumnSpaces) {
        console.log("ディレクトリを（columnsもchildColumnSpacesも無い）別ディレクトリにドロップした")
        console.log("された", droppedElementDataset)      //ドロップされた側
        console.log("した側", dropElementDatase)          //ドロップしたがわ

        const res = await remote.dialog.showMessageBox({
          type: 'info',
          buttons: ['はい', "いいえ"],
          title: 'タイトル',
          message: 'カラムスペースの移動',
          detail: `${dropElementDatase.name}を${droppedElementDataset.name}配下に移動しますか？`
        });
        if (res.response === 0) {
          const newColumnSpaces = await moveColumnSpaceUseCase(dropElementDatase.uuid, droppedElementDataset.uuid);
          setColumnSpaces(newColumnSpaces);
        }
      }

      document.removeEventListener("mouseup", onMouseUpFromDirectoryDragging)
      setDirectoryDraggingState(DirectoryDraggingState.Releasing)
      setDraggingTargetInfo(null)
    }

    document.addEventListener("mouseup", onMouseUpFromDirectoryDragging)
    setDirectoryDraggingState(DirectoryDraggingState.Downed)
    setDraggingTargetInfo(event.target.parentElement.parentElement.dataset)

  }, [setDirectoryDraggingState, setDraggingTargetInfo, setColumnSpaces] )

  // ドラッグ状態の管理
  const handleDragStartOnDirectory = useCallback(() => {
    if (directoryDraggingState === DirectoryDraggingState.Downed) {
      setDirectoryDraggingState(DirectoryDraggingState.Dragging)
    }
  }, [directoryDraggingState, setDirectoryDraggingState])

  // ドラッグ状態の管理
  const handleDragOverOnDirectory = useCallback(() => {
    if (directoryDraggingState === DirectoryDraggingState.Dragging) {
      console.log("onmouseover")
      console.log(draggingTargetInfo)
    }
  }, [directoryDraggingState])

  // ColumnSpacesのツリーをレンダリング
  const generateColumnSpaceElementTree = useCallback((columnSpaces: ColumnSpaces) => {

    return columnSpaces.children.map((columnSpace) => {
      return (
        <TreeItem
          key={columnSpace.id}
          nodeId={columnSpace.id}
          label={columnSpace.name}
          onMouseDown={handleMouseDownOnDirectory}
          onMouseMove={handleDragStartOnDirectory}
          onMouseOver={handleDragOverOnDirectory}
          onContextMenu={handleRightClickOnColumnSpace}
          data-type={FileSystemEnum.ColumnSpace}
          data-name={columnSpace.name}
          data-uuid={columnSpace.id}
          data-has-child-column-spaces={!!(columnSpace.canAddChildColumnSpace())}
          data-has-columns={!!(columnSpace.hasColumns())}
        >
          {columnSpace.canAddChildColumnSpace()
            // カラムスペースを再帰レンダリング
            ? generateColumnSpaceElementTree(columnSpace.childColumnSpaces)
            // カラムをレンダリング
            : columnSpace.columns.children.map((column) =>
                <TreeItem
                  key={column.id}
                  nodeId={column.id}
                  label={column.name}
                  onContextMenu={handleRightClickOnColumn}
                />
              )
          }
        </TreeItem>
      )
    })
  }, [handleMouseDownOnDirectory, handleDragStartOnDirectory, handleDragOverOnDirectory, handleRightClickOnColumnSpace, handleRightClickOnColumn])

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
    classes,
    newColumnFormVisible,
    //関数
    generateColumnSpaceElementTree,
    //イベントハンドラ
    handleDragOverOnDirectory,
    handleDragStartOnDirectory,
    handleClickAddColumnSpaceButton,
    handleRightClickOnEmptySpace,
    handleSubmitNewColumnSpaceForm,
    handleNewColumnInputOnBlur,
    //他
    newColumnSpaceInputRef,
  }
}