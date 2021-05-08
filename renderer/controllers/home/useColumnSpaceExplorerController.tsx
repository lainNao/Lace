import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import TreeItem from '@material-ui/lab/TreeItem';
import { makeStyles } from '@material-ui/core/styles';
import { useRecoilCallback, useRecoilState, useRecoilValueLoadable } from 'recoil';
import columnSpacesState from '../../atoms/columnSpacesState';
import { ColumnDataType, FileSystemEnum } from "../../enums/app"
import { ColumnSpaces } from '../../models/ColumnSpaces';
import { createTopLevelColumnSpaceUseCase } from '../../usecases/createTopLevelColumnSpaceUseCase';
import { moveColumnSpaceUseCase } from '../../usecases/moveColumnSpaceUseCase';
import { showColumnContextMenu } from '../../context-menus/showColumnContextMenu';
import { showColumnSpaceContextMenu } from '../../context-menus/showColumnSpaceContextMenu';
import { showEmptySpaceContextMenu } from '../../context-menus/showEmptySpaceContextMenu';
import { remote } from "electron"
import useSetupColumnSpaces from '../../hooks/useSetupColumnSpaces';
import { removeColumnSpaceUseCase } from '../../usecases/removeColumnSpaceUseCase';
import useSetupSettings from '../../hooks/useSetupSettings';
import { createDescendantColumnSpaceUseCase } from '../../usecases/createDescendantColumnSpaceUseCase';
import { TrimedFilledString } from '../../value-objects/TrimedFilledString';
import { createColumnUseCase } from '../../usecases/createColumnUseCase';
import { useDisclosure } from '@chakra-ui/react';


const useStyles = makeStyles({
  label: {
    fontSize: "15px"
  },
});

// TODO テーマとかどうするか
// TODO ルート階層のカラムスペースに移動する処理思いついてなかった。作る。empty space部分にDnDしたらおなじみの処理すればいいだけ
// TODO カラムの右側にカラムタイプをラベルで表示しておく（またはアイコンで左に）
// TODO カラムのデータタイプの選択肢は多言語対応させたい（データとして格納するEnumとは別のまた見せる用の選択肢のEnumとか作ればいいかも）
// TODO カラムをDnDで入れ替えたい

// memo 基本的にコントローラーでカラムスペースを扱う時は、高速化のためにidだけで扱う。別に直接columnSpacesをいじってもいいけどたぶん処理がサービス内とわりと二重になるから…
export const useColumnSpaceExplorerController = () => {
  // メタ状態類
  const [columnSpaces, setColumnSpaces] = useSetupColumnSpaces();
  // UI状態類
  const classes = useStyles()
  const [expandedColumnSpaces, setExpandedColumnSpaces] = useSetupSettings();
  const [selectedNodeId, setSelectedNodeId] = useState<string>(null);
  const [justBlured, setJustBlured] = useState<boolean>(false);
  const { isOpen: isNewColumnFormOpen, onOpen: openNewColumnForm, onClose: closeNewColumnForm } = useDisclosure();
  const [newColumnFormName, setNewColumnFormName] = useState<string>("");
  const [newColumnFormId, setNewColumnFormId] = useState<string>(null);
  // ref
  const newTopLevelColumnSpaceFormRef = React.useRef(null);
  const newColumnSpacesFormRefs = React.useRef([]);
  const newColumnFormRef = React.useRef(null);

  const handleRightClickOnColumnSpace = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラムスペースのコンテキストメニュー表示");
    event.preventDefault();
    event.stopPropagation();

    const targetDataset = (event.target as HTMLElement).parentElement.parentElement.parentElement.dataset;
    setSelectedNodeId(targetDataset.id);

    showColumnSpaceContextMenu(event, {
      handleClickDeleteColumnSpace: async () => {
        remote.dialog.showMessageBox({
          type: 'info',
          buttons: ['はい', "いいえ"],
          title: 'カラムスペースの削除',
          message: 'カラムスペースの削除',
          detail: `${targetDataset.name}を削除しますか？`,
        }).then(async (res) => {
          if (res.response === 0) { //「はい」を選択した時
            try {
              const newColumnSpaces = await removeColumnSpaceUseCase(targetDataset.id);
              setColumnSpaces(newColumnSpaces);
            } catch (e) {
              console.log(e.message);
            }
          }
        });

      },
      handleClickAddChildColumnSpace: async () => {
        newColumnSpacesFormRefs.current[targetDataset.id].classList.remove("hidden");
        newColumnSpacesFormRefs.current[targetDataset.id].elements.namedItem("new-column-space-name").focus();
      },
      handleClickAddChildColumn: async () => {
        setNewColumnFormId(targetDataset.id);
        openNewColumnForm();
      },
      targetColumnSpaceDataset: targetDataset,
    });
  }, [columnSpaces]);

  const handleRightClickOnColumn = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラムのコンテキストメニュー表示");
    event.preventDefault();
    event.stopPropagation();
    setSelectedNodeId((event.target as HTMLElement).parentElement.parentElement.dataset.id);
    showColumnContextMenu(event);
  }, []);

  const handleRightClickOnEmptySpace = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("エクスプローラーの無部分押下時のコンテキストメニュー表示");
    event.preventDefault();
    event.stopPropagation();

    showEmptySpaceContextMenu(event, {
      handleClickAddColumnSpace: () => {
        newTopLevelColumnSpaceFormRef.current.classList.remove("hidden");
        setImmediate(() => {
          newTopLevelColumnSpaceFormRef.current.elements.namedItem("new-column-space-name").focus();
        });
      }
    });
  }, [showEmptySpaceContextMenu]);

  const handleClickAddColumnSpaceButton = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラムスペース追加ボタン押下");
    event.preventDefault();
    newTopLevelColumnSpaceFormRef.current.classList.remove("hidden");
    setImmediate(() => {
      newTopLevelColumnSpaceFormRef.current.elements.namedItem("new-column-space-name").focus();
    })
  }, [justBlured]);

  const handleSubmitTopLevelNewColumnSpaceForm = useRecoilCallback(({set}) => async (event: React.FormEvent<HTMLFormElement>) => {
    console.debug("ルートレベルのカラムスペース追加フォームsubmit");
    try {
      event.preventDefault();
      newTopLevelColumnSpaceFormRef.current.classList.add("hidden");
      newTopLevelColumnSpaceFormRef.current.elements.namedItem("new-column-space-name").blur();

      // 新しいカラムスペースを追加
      const newColumnSpaceName = new TrimedFilledString(newTopLevelColumnSpaceFormRef.current.elements.namedItem("new-column-space-name").value);
      const newColumnSpaces = await createTopLevelColumnSpaceUseCase(newColumnSpaceName);
      set(columnSpacesState, newColumnSpaces);
    } catch (e) {
      console.log(e.message);
    } finally {
      newTopLevelColumnSpaceFormRef.current.elements.namedItem("new-column-space-name").value = null;
    }

  }, [setJustBlured]);

  const handleSubmitNewColumnSpaceForm = useRecoilCallback(({set}) => async (event: React.FormEvent<HTMLFormElement>, columnSpaceId: string) => {
    console.debug("カラムスペース追加フォームsubmit");
    try {
      event.preventDefault();
      newColumnSpacesFormRefs.current[columnSpaceId].classList.add("hidden");
      newColumnSpacesFormRefs.current[columnSpaceId].elements.namedItem("new-column-space-name").blur();

      // 指定IDのカラムスペースの子に新しいカラムスペースを追加
      const newColumnSpaceName = new TrimedFilledString(newColumnSpacesFormRefs.current[columnSpaceId].elements.namedItem("new-column-space-name").value);
      const newColumnSpaces = await createDescendantColumnSpaceUseCase(columnSpaceId, newColumnSpaceName);
      set(columnSpacesState, newColumnSpaces);
      setExpandedColumnSpaces((currentExpanded) => [...currentExpanded, columnSpaceId]);
    } catch (e) {
      console.log(e.message);
    } finally {
      newColumnSpacesFormRefs.current[columnSpaceId].elements.namedItem("new-column-space-name").value = null;
    }
  }, [setExpandedColumnSpaces]);

  const handleSubmitNewColmnForm = useCallback(async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラム新規作成モーダルのsubmit");
    try {
      const newColumnSpaces = await createColumnUseCase(
        new TrimedFilledString(newColumnFormRef.current.elements.namedItem("column-name").value),
        newColumnFormId,
        newColumnFormRef.current.elements.namedItem("column-type").value
      );
      setColumnSpaces(newColumnSpaces);
    } catch (e) {
      console.log(e.message);
    } finally {
      setNewColumnFormName("");
      closeNewColumnForm();
    }
  }, [newColumnFormName, newColumnFormId, closeNewColumnForm])

  const handleChangeNewColumnNameInput = useCallback((event) => {
    console.debug("カラム新規作成モーダルのカラム名インプットのonchange");
    setNewColumnFormName(event.target.value);
  }, [setExpandedColumnSpaces]);

  const handleClickNewColmnFormClose = useCallback((event) => {
    console.debug("カラム新規作成モーダルのキャンセル");
    closeNewColumnForm();
  }, [closeNewColumnForm]);

  const handleTreeNodeToggle = useCallback((event, expandedNodeIds) => {
    console.debug("ツリービュー展開のトグル");
    localStorage.setItem("expandedColumnSpaces", JSON.stringify(expandedNodeIds));
    setExpandedColumnSpaces(expandedNodeIds);
  }, [setExpandedColumnSpaces]);

  const handleDragStartOnNode = useCallback((event) => {
    console.debug("DnDでカラムスペース/カラムの移動開始");
    event.dataTransfer.setData("fromId", (event.target as HTMLElement).parentElement.parentElement.parentElement.dataset.id)
  }, []);

  const handleDragOverOnNode = useCallback((event) => {
    console.debug("DnDでカラムスペース/カラムの移動中のマウスオーバー");
    event.preventDefault();
  }, []);

  const handleDropOnNode = useCallback(async(event) => {
    console.debug("DnDでカラムスペース/カラムの移動中のドロップ");
    try {
      const fromId = event.dataTransfer.getData("fromId");
      const toId = (event.target as HTMLElement).parentElement.parentElement.parentElement.dataset.id

      const newColumnSpaces = await moveColumnSpaceUseCase(fromId, toId);
      setColumnSpaces(newColumnSpaces);
      setExpandedColumnSpaces((currentExpanded) => [...currentExpanded, toId]);
    } catch (e) {
      console.log(e.message);
    }
  }, [columnSpaces, setExpandedColumnSpaces]);

  // ColumnSpacesのツリーをレンダリング
  const generateColumnSpaceElementTree = useCallback((columnSpaces: ColumnSpaces) => {

    return columnSpaces.children.map((columnSpace) => {
      return (
        <React.Fragment key={columnSpace.id} >
          <TreeItem
            nodeId={columnSpace.id}
            label={
              <div draggable
                onDragStart={handleDragStartOnNode}
                onDragOver={handleDragOverOnNode}
                onDrop={handleDropOnNode}
              >{`${columnSpace.name}`}</div>
            }
            onContextMenu={handleRightClickOnColumnSpace}
            data-type={FileSystemEnum.ColumnSpace}
            data-name={`${columnSpace.name}`}
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
              // TODO ここだけTreeItemでなくてもよいかもしれない
              : columnSpace.columns.children.map((column) =>
                  <TreeItem
                    draggable
                    key={column.id}
                    nodeId={column.id}
                    label={`${column.name}`}
                    onContextMenu={handleRightClickOnColumn}
                    onDragStart={handleDragStartOnNode}
                    onDragOver={handleDragOverOnNode}
                    onDrop={handleDropOnNode}
                    data-type={FileSystemEnum.Column}
                    data-name={`${column.name}`}
                    data-id={column.id}
                    //TODO collapsableとかcellsとかのあれこれの値も入れて使う時もあるかもなのでその時考慮して追加も考える
                  />
                )
            }
          </TreeItem>
          <form className="ml-9 hidden" data-id={columnSpace.id} onSubmit={event => {handleSubmitNewColumnSpaceForm(event, columnSpace.id)}} ref={elem => newColumnSpacesFormRefs.current[columnSpace.id] = elem}>
            <input name="new-column-space-name" className="bg-gray-700" spellCheck={false}></input>
          </form>
        </React.Fragment>
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
    expandedColumnSpaces,
    selectedNodeId,
    isNewColumnFormOpen,
    newColumnFormName,
    //関数
    generateColumnSpaceElementTree,
    //イベントハンドラ
    handleClickAddColumnSpaceButton,
    handleRightClickOnEmptySpace,
    handleSubmitTopLevelNewColumnSpaceForm,
    handleTreeNodeToggle,
    closeNewColumnForm,
    handleChangeNewColumnNameInput,
    handleClickNewColmnFormClose,
    handleSubmitNewColmnForm,
    //他
    newTopLevelColumnSpaceFormRef,
    newColumnFormRef,
  }
}