import React, {ReactElement, useCallback} from 'react';
import TreeItem from '@material-ui/lab/TreeItem';
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import columnSpacesState from '../atoms/columnSpacesState';
import useMoveColumnSpace from '../hooks/useMoveColumnSpace';
import useSetupColumnSpaces from '../hooks/useSetupColumnSpaces';
import { ContextMenuTargetType } from "../enums/app"
import { ColumnSpace } from '../models/ColumnSpace';
import { Column } from '../models/Column';
import { ColumnSpaces } from '../models/ColumnSpaces';
import { createNewColumnSpace } from '../usecases/createNewColumnSpace';

const initialState = {
  targetType: null,
  mouseX: null,
  mouseY: null,
};

enum DirectoryDraggingState {
  Releasing,
  Downed,
  Dragging,
}

interface onContextMenuMeta {
  targetType: ContextMenuTargetType,
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

export const useHomeController = () => {
  const columnSpaces = useSetupColumnSpaces();
  const moveColumnSpace = useMoveColumnSpace();
  const classes = useStyles();
  const [contextMenuState, setContextMenuState] = React.useState(initialState);
  const [directoryDraggingState, setDirectoryDraggingState] = React.useState(DirectoryDraggingState.Releasing);
  const [draggingTargetInfo, setDraggingTargetInfo] = React.useState<targetElementDatasets>(null);
  const [isOpeningModal, setIsOpeningModal] = React.useState(false);
  const [modalContent, setModalContent] = React.useState<ReactElement<any, any>>();

  const addColumnSpace = useRecoilCallback(({set}) => async (columnSpaceName: string) => {
    //todo これ、handleClickColumnSpaceAddButtonに移す（移される側？）。サービスのメソッド名で大体分かるだろうということで、わざわざここを２つに分けることないから。
    const newColumnSpaces = await createNewColumnSpace(columnSpaceName)
    set(columnSpacesState, newColumnSpaces)
  });

  /// 以下ツリー右クリック関連の処理
  /// コンテキストメニューの処理をいろいろ実装すること
  const handleRightClickOnTree = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>, meta: onContextMenuMeta) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenuState({
      targetType: meta.targetType,
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  }, [setContextMenuState]);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenuState(initialState);
  }, [setContextMenuState]);

  const handleOpenModal = useCallback((modalContent: ReactElement<any,any>) => {
    setIsOpeningModal(true);
    setModalContent(modalContent)
  }, [setIsOpeningModal, setModalContent]);

  const handleCloseModal = useCallback(() => {
    setIsOpeningModal(false);
  }, [setIsOpeningModal]);

  const handleClickColumnSpaceAddButton = useCallback((_, newColumnSpaceName) => {
    addColumnSpace(newColumnSpaceName)
  }, [addColumnSpace])

  /// 以下ディレクトリを別ディレクトリにドロップする関連の処理
  /// ドロップしている要素の名前をマウスの右下に出すこと、別ディレクトリにドロップ中にされてる側の背景色が変わること（できれば）、ドロップした後に確認モーダルで決定したら移動されること
  /// ディレクトリをドロップで移動したらファイルも移動になるのでどうしよう。UUIDのみのフォルダに統一できるなら移動する必要ないけどその場合は親子関係をなんらかの値で表現して読み取る必要ある。
  /// そもそもディレクトリ構造にカラムスペースのフォルダは不要なのでは。カラムのみでいい。それならいくらでも移動できる。多分この考えでいける。となるとディレクトリ構造変えるのも対応する必要あり。まずリポジトリ内のソース変更してそこ対応してしまおう、その後にいろいろやろう。でも親子構造をどうデータに反映するかな。
  const handleMouseDownOnDirectory = useCallback((event) => {

    const onMouseUpFromDirectoryDragging = (innerEvent) => {
      const droppedElementDataset = innerEvent.toElement.parentElement.parentElement.dataset;
      const dropElementDatase = event.target.parentElement.parentElement.dataset;
      const areBothDirectory: boolean = (droppedElementDataset.type == ContextMenuTargetType.Directory.valueOf())
      const areBothDifferent: boolean = (droppedElementDataset.uuid !== dropElementDatase.uuid)
      const isDroppedHasNoColumnsOrChildColumnSpaces = (droppedElementDataset.hasChildColumnSpaces === "false" && droppedElementDataset.hasColumns === "false")
      if (areBothDirectory && areBothDifferent && isDroppedHasNoColumnsOrChildColumnSpaces) {
        console.log("ディレクトリを（columnsもchildColumnSpacesも無い）別ディレクトリにドロップした")
        console.log("された", droppedElementDataset)      //ドロップされた側
        console.log("した側", dropElementDatase)          //ドロップしたがわ
        moveColumnSpace(dropElementDatase.uuid, droppedElementDataset.uuid)

        handleOpenModal(
          <div>
            <h3 className="font-semibold mb-3 text-center">どうしますか？</h3>
            <div className="flex justify-around">
              <Button variant="contained" color="primary"onClick={() => {
                // service.MoveDir(fromUUID, toUUID)
                handleCloseModal();
              }}>はい</Button>
              <Button variant="contained" onClick={handleCloseModal}>いいえ</Button>
            </div>
          </div>
        )
      }

      document.removeEventListener("mouseup", onMouseUpFromDirectoryDragging)
      setDirectoryDraggingState(DirectoryDraggingState.Releasing)
      setDraggingTargetInfo(null)
    }

    document.addEventListener("mouseup", onMouseUpFromDirectoryDragging)
    setDirectoryDraggingState(DirectoryDraggingState.Downed)
    setDraggingTargetInfo(event.target.parentElement.parentElement.dataset)

  }, [handleOpenModal, setDirectoryDraggingState, setDraggingTargetInfo] )

  const handleDragStartOnDirectory = useCallback(() => {
    if (directoryDraggingState === DirectoryDraggingState.Downed) {
      setDirectoryDraggingState(DirectoryDraggingState.Dragging)
    }
  }, [directoryDraggingState, setDirectoryDraggingState])

  const handleDragOverOnDirectory = useCallback(() => {
    if (directoryDraggingState === DirectoryDraggingState.Dragging) {
      console.log("onmouseover")
      console.log(draggingTargetInfo)
    }
  }, [directoryDraggingState])

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
          onContextMenu={(event) => handleRightClickOnTree(event, {targetType: ContextMenuTargetType.Directory})}
          data-type={ContextMenuTargetType.Directory}
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
                  onContextMenu={(event) => handleRightClickOnTree(event, {targetType: ContextMenuTargetType.Column})}
                />
              )
          }
        </TreeItem>
      )
    })
  }, [handleMouseDownOnDirectory, handleDragStartOnDirectory, handleDragOverOnDirectory, handleRightClickOnTree])



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
    isOpeningModal,
    classes,
    modalContent,
    contextMenuState,
    //関数
    generateColumnSpaceElementTree,
    //イベントハンドラ
    handleCloseContextMenu,
    handleDragOverOnDirectory,
    handleDragStartOnDirectory,
    handleRightClickOnTree,
    handleCloseModal,
    handleClickColumnSpaceAddButton,

  }
}