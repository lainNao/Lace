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
import draggingNodeDatasetState from '../../atoms/home/ColumnSpaceExplorer/draggingNodeDatasetState';
import { cloneDeep } from "lodash";
import { changeColumnOrderUseCase } from '../../usecases/changeColumnOrderUseCase';


// TODO テーマとかどうするか
// TODO ルート階層のカラムスペースに移動する処理思いついてなかった。作る。empty space部分にDnDしたらおなじみの処理すればいいだけ
// TODO カラムの右側にカラムタイプをラベルで表示しておく（またはアイコンで左に）
// TODO カラムのデータタイプの選択肢は多言語対応させたい（データとして格納するEnumとは別のまた見せる用の選択肢のEnumとか作ればいいかも）
// TODO カラムをDnDで入れ替えたい
// TODO expandedを変更する時、先祖も全部expandedに加えないといけないかも？（調べて）。なんかホットリロードされた時に先祖が閉じるっぽい現象がたまにある（単なるバグかもなので見てみて）
// TODO カラムは縦線でつなげたい（通じる言葉で書けない）。カラム今青文字で判断してるけどそれを青文字じゃなくて、左側に「|」の線置いて判断したい感じ

// memo 基本的にコントローラーでカラムスペースを扱う時は、高速化のためにidだけで扱う。別に直接columnSpacesをいじってもいいけどたぶん処理がサービス内とわりと二重になるから…
export const useColumnSpaceExplorerController = () => {
  // メタ状態類
  const [columnSpaces, setColumnSpaces] = useSetupColumnSpaces();
  // UI状態類
  const [expandedColumnSpaces, setExpandedColumnSpaces] = useSetupSettings();
  const [selectedNodeId, setSelectedNodeId] = useState<string>(null);
  const { isOpen: isNewColumnFormOpen, onOpen: openNewColumnForm, onClose: closeNewColumnForm } = useDisclosure();
  const [newColumnFormName, setNewColumnFormName] = useState<string>("");
  const [newColumnFormId, setNewColumnFormId] = useState<string>(null);   //NOTE: 新しいカラムを追加する対象のカラムスペースのID。名前紛らわしいから変えたい
  const [draggingNodeDataset, setDraggingNodeDataset] = useRecoilState(draggingNodeDatasetState);
  // ref
  const newTopLevelColumnSpaceFormRef = React.useRef(null);
  const newColumnSpacesFormRefs = React.useRef([]);
  const newColumnFormRef = React.useRef(null);
  const lastAddedBorderElementRef = React.useRef(null);
  const isLeavingToParentColumnSpace = React.useRef(null);

  /* -----------------------------------------------------一般----------------------------------------------------------- */

  const handleClickColumn = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラムスペースのコンテキストメニュー表示");
    event.preventDefault();
    event.stopPropagation();

    const targetDataset = (event.target as HTMLElement).parentElement.parentElement.parentElement.dataset;
    setSelectedNodeId(targetDataset.id);

  }, []);

  /* -----------------------------------------------------コンテキストメニュー管理----------------------------------------------------------- */

  const handleRightClickOnColumnSpace = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラムスペースのコンテキストメニュー表示");
    event.preventDefault();
    event.stopPropagation();

    const targetDataset = (event.target as HTMLElement).dataset;
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
  }, []);

  const handleRightClickOnColumn = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラムのコンテキストメニュー表示");
    event.preventDefault();
    event.stopPropagation();
    setSelectedNodeId((event.target as HTMLElement).parentElement.parentElement.parentElement.dataset.id);
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
  }, []);

  /* -----------------------------------------------------各種フォーム管理----------------------------------------------------------- */

  const handleClickAddColumnSpaceButton = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラムスペース追加ボタン押下");
    event.preventDefault();
    newTopLevelColumnSpaceFormRef.current.classList.remove("hidden");
    setImmediate(() => {
      newTopLevelColumnSpaceFormRef.current.elements.namedItem("new-column-space-name").focus();
    })
  }, []);

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

  }, []);

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
  }, []);

  const handleClickCreateNewColumn = useCallback(async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラム新規作成モーダルの作成ボタン押下");
    try {
      const newColumnSpaces = await createColumnUseCase(
        new TrimedFilledString(newColumnFormRef.current.elements.namedItem("column-name").value),
        newColumnFormId,
        newColumnFormRef.current.elements.namedItem("column-type").value,
      );
      setColumnSpaces(newColumnSpaces);
      if (!expandedColumnSpaces.includes(newColumnFormId)) {
        setExpandedColumnSpaces((currentExpanded) => [...currentExpanded, newColumnFormId]);
      }
    } catch (e) {
      console.log(e.message);
    } finally {
      setNewColumnFormName("");
      closeNewColumnForm();
    }
  }, [newColumnFormId])

  const handleChangeNewColumnNameInput = useCallback((event) => {
    console.debug("カラム新規作成モーダルのカラム名インプットのonchange");
    setNewColumnFormName(event.target.value);
  }, []);

  const handleClickNewColmnFormClose = useCallback((event) => {
    console.debug("カラム新規作成モーダルのキャンセル");
    closeNewColumnForm();
  }, []);

  const handleTreeNodeToggle = useCallback((event, expandedNodeIds) => {
    console.debug("ツリービュー展開のトグル");
    localStorage.setItem("expandedColumnSpaces", JSON.stringify(expandedNodeIds));
    setExpandedColumnSpaces(expandedNodeIds);
  }, [expandedColumnSpaces]);

  /* -----------------------------------------------------カラムスペースのDnD----------------------------------------------------------- */

  const handleDragStartOnColumnSpace = useCallback((event) => {
    console.debug("カラムスペースのドラッグ開始");
    event.dataTransfer.setData("columnSpaceId", (event.target as HTMLElement).dataset.id);
    event.dataTransfer.setData("draggingNodeType", FileSystemEnum.ColumnSpace)
    setDraggingNodeDataset(event.target.dataset);

  }, []);

  const handleDragEnterOnColumnSpace = useRecoilCallback(({snapshot}) => async(event: React.DragEvent<HTMLElement>) => {
    console.debug("カラムスペースへのドラッグエンター");
    event.preventDefault();
    //TODO マウス乗せられたら、移動できるなら色つけるとかしたい　できればホバー時のみスタイル変わるのと組み合わせてCSSの追加削除じゃないので対応したい

    const enteredColumnSpace = event.target as HTMLElement;
    const enteredColumnSpaceDataset = enteredColumnSpace.dataset;
    const draggingNodeDataset = await snapshot.getPromise(draggingNodeDatasetState)

    if (draggingNodeDataset && Number(draggingNodeDataset.type) === FileSystemEnum.Column && draggingNodeDataset.columnSpaceId === enteredColumnSpaceDataset.id) {
      // カラムをドラッグしており、その親のカラムスペースへのエンターの場合
      isLeavingToParentColumnSpace.current = true;
      lastAddedBorderElementRef.current.classList.remove("border-b-2");
      lastAddedBorderElementRef.current.classList.add("border-t-2");
    } else {
      // それ以外の普通のカラムスペースへのドラッグエンターの場合
      if (lastAddedBorderElementRef.current) {
        lastAddedBorderElementRef.current.classList.remove("border-b-2");
        lastAddedBorderElementRef.current.classList.remove("border-t-2");
      }
    }

    // if (event.dataTransfer.getData("columnSpaceId") !== targetDataset.columnSpaceId) { //TODO これ、ここでやる必要ないかも　ドメイン層で勝手にやるはず
    //   return;
    // }

  }, []);

  const handleDragOverOnColumnSpace = useCallback((event) => {
    // console.debug("カラムスペースへのドラッグオーバー");
    event.preventDefault(); //NOTE: DragOverにてpreventDefaultしないとdropが発火しないため記述
  }, []);


  const handleDragLeaveOnColumnSpace = useCallback((event) => {
    // console.debug("カラムスペースへのドラッグオーバー");
    event.preventDefault(); //NOTE: DragOverにてpreventDefaultしないとdropが発火しないため記述
    isLeavingToParentColumnSpace.current = false;
  }, []);

  const handleDropOnColumnSpace = useRecoilCallback(({snapshot, set}) => async(event: React.DragEvent<HTMLElement>) => {
    console.debug("カラムスペースへのドロップ");

    if (lastAddedBorderElementRef.current) {
      lastAddedBorderElementRef.current.classList.remove("border-t-2");
      lastAddedBorderElementRef.current.classList.remove("border-b-2");
    }
    const draggingNodeDataset = await snapshot.getPromise(draggingNodeDatasetState);
    if (draggingNodeDataset.type == FileSystemEnum.Column) {

      if (draggingNodeDataset.columnSpaceId == (event.target as HTMLElement).dataset.id) {
        // 親ならカラムをソートをする
        try {
          const newColumnSpaces = await changeColumnOrderUseCase(draggingNodeDataset.columnSpaceId, draggingNodeDataset.id);
          setColumnSpaces(newColumnSpaces);
        } catch(e) {
          console.log(e.message);
        }
      }

      set(draggingNodeDatasetState, null);
      return;
    }

    // カラムスペースを移動する
    try {
      const fromId = event.dataTransfer.getData("columnSpaceId");
      const toId = (event.target as HTMLElement).dataset.id;
      const newColumnSpaces = await moveColumnSpaceUseCase(fromId, toId);
      setColumnSpaces(newColumnSpaces);
      setExpandedColumnSpaces((currentExpanded) => [...currentExpanded, toId]);
    } catch (e) {
      console.log(e.message);
    } finally {
      set(draggingNodeDatasetState, null);
    }
  }, []);

  /* -----------------------------------------------------カラムのDnD----------------------------------------------------------- */

  const handleDragStartOnColumn = useCallback((event) => {
    console.debug("カラムのドラッグ開始");
    setDraggingNodeDataset(event.target.dataset);
  }, []);

  const handleDragEnterOnColumn = useRecoilCallback(({snapshot}) => async(event: React.DragEvent<HTMLElement>) => {
    console.debug("カラムへのドラッグエンター");
    event.preventDefault();

    const draggingNodeDataset = await snapshot.getPromise(draggingNodeDatasetState);
    if (Number(draggingNodeDataset.type) === FileSystemEnum.ColumnSpace) {
      return;
    }

    const enteredNode = (event.target as HTMLElement);
    const enteredNodeDataset = enteredNode.parentElement.parentElement.parentElement.dataset;
    enteredNode.classList.remove("border-t-2");

    if (enteredNodeDataset.columnSpaceId === draggingNodeDataset.columnSpaceId) {
      // 同じカラムスペースのカラムへのEnterなら
      enteredNode.classList.add("border-b-2");
      enteredNodeDataset.addedBorder = "true";
      lastAddedBorderElementRef.current = enteredNode;
      return;
    } else {
      // 違うカラムスペースのカラムへのEnterなら
      lastAddedBorderElementRef.current.classList.remove("border-b-2");
      lastAddedBorderElementRef.current.classList.remove("border-t-2");
      return;
    }

  }, []);

  const handleDragLeaveOnColumn = useRecoilCallback(({}) => async(event: React.DragEvent<HTMLElement>) => {
    console.debug("カラムからのドラッグリーブ");
    event.preventDefault();

    const leavedNode = (event.target as HTMLElement);
    const leavdNodeDataset = leavedNode.parentElement.parentElement.parentElement.dataset;
    if (leavdNodeDataset.addedBorder === "true") {
      leavedNode.classList.remove("border-b-2");
      console.log(isLeavingToParentColumnSpace.current)
      if (isLeavingToParentColumnSpace.current !== true) {
        leavedNode.classList.remove("border-t-2");
      }
    }
  }, []);

  const handleDragOverOnColumn = useCallback((event) => {
    // console.debug("カラムへのドラッグオーバー");
    event.preventDefault(); //NOTE: DragOverにてpreventDefaultしないとdropが発火しないため記述
  }, []);

  const handleDropOnColumn = useRecoilCallback(({snapshot, set}) => async(event: React.DragEvent<HTMLElement>) => {
    console.debug("カラムへのドロップ");

    const draggingNodeDataset = await snapshot.getPromise(draggingNodeDatasetState)
    const targetColumnDataset = (event.target as HTMLElement).parentElement.parentElement.parentElement.dataset;
    // const draggingNodeDatasetCopied = cloneDeep(draggingNodeDataset);
    set(draggingNodeDatasetState, null);

    if (lastAddedBorderElementRef.current) {
      lastAddedBorderElementRef.current.classList.remove("border-b-2");
      lastAddedBorderElementRef.current = null;
    }

    // カラム以外のものがカラムにドロップされてもこれ以上することがないのでここでリターン
    if (Number(draggingNodeDataset.type) === FileSystemEnum.ColumnSpace) {
      console.debug("カラムスペースをカラムにドロップすることに対するアクションは未定です");
      return;
    }

    // 違うカラムスペースのもの同士ならDnDではすることがないのでここでリターン
    if (targetColumnDataset.columnSpaceId !== draggingNodeDataset.columnSpaceId) {
      console.debug("カラムスペースが異なります");
      return;
    }

    // DROPした時にその状態を読み取って順番入れ替えて保存
    // TODO 親にドロップされたら、今ドラッグしてるやつを、指定のカラムスペースの先頭に移動すればいい（ただここはカラムスペースのところに処理書くことになる）

    try {
      const newColumnSpaces = await changeColumnOrderUseCase(targetColumnDataset.columnSpaceId, draggingNodeDataset.id, targetColumnDataset.id);
      setColumnSpaces(newColumnSpaces);
    } catch(e) {
      console.log(e.message);
    }
  }, [columnSpaces, draggingNodeDataset]);

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
    //ref
    newTopLevelColumnSpaceFormRef,
    newColumnFormRef,
    newColumnSpacesFormRefs,
    //イベントハンドラ
    handleClickAddColumnSpaceButton,
    handleRightClickOnEmptySpace,
    handleSubmitTopLevelNewColumnSpaceForm,
    handleTreeNodeToggle,
    handleChangeNewColumnNameInput,
    handleClickNewColmnFormClose,
    handleClickCreateNewColumn,
    handleRightClickOnColumn,
    handleClickColumn,
    handleDragOverOnColumn,
    handleDropOnColumn,
    handleDragEnterOnColumn,
    handleDragLeaveOnColumn,
    handleDragStartOnColumn,
    handleDragOverOnColumnSpace,
    handleDragLeaveOnColumnSpace,
    handleDropOnColumnSpace,
    handleDragEnterOnColumnSpace,
    handleDragStartOnColumnSpace,
    handleSubmitNewColumnSpaceForm,
    handleRightClickOnColumnSpace,
    //他
    closeNewColumnForm,
  }
}