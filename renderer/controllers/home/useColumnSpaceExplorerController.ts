import React, {ReactElement, useMemo, useCallback, useEffect, useState} from 'react';
import { useRecoilCallback, useRecoilState } from 'recoil';
import columnSpacesState from '../../atoms/columnSpacesState';
import { FileSystemEnum } from "../../resources/enums/app"
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
import { changeColumnOrderUseCase } from '../../usecases/changeColumnOrderUseCase';
import { moveColumnSpaceToTopLevelUseCase } from '../../usecases/moveColumnSpaceToTopeLevelUseCase';
import { removeColumnUseCase } from '../../usecases/removeColumnUseCase';
import { renameColumnUseCase } from '../../usecases/renameColumnUseCase';
import { createCellUseCase } from '../../usecases/createCellUseCase';
import { ColumnDataset } from '../../resources/types';

//TODO 結局useCallbackの第二引数使えないじゃんってなって、そこに追加してるけど意味ないの消しちゃったりしたんだけど、実際どう使うのが正解なの？調べて。それによってはgetPromise(～)は使わなくなる
//TODO おそらく、「inputを出したまま右側で編集する」とかなるとバグるかもしれないので、そこを一応留意しておきたい。逆に右側で編集中に左側いじっても同じことになる可能性あり。フラグを足すことになるかも

//NOTE: 基本的にコントローラーでカラムスペースを扱う時はidだけで扱う。責務的に。
export const useColumnSpaceExplorerController = () => {
  // メタ状態類
  const [columnSpaces, setColumnSpaces] = useSetupColumnSpaces();
  // UI状態類
  const [expandedColumnSpaces, setExpandedColumnSpaces] = useSetupSettings();
  const [selectedNodeId, setSelectedNodeId] = useState<string>(null);
  const [selectedColumnDataset, setSelectedColumnDataset] = useState(null);
  const { isOpen: isNewColumnFormOpen, onOpen: openNewColumnForm, onClose: closeNewColumnForm } = useDisclosure();
  const { isOpen: isNewCellFormOpen, onOpen: openNewCellFormOpen, onClose: closeNewCellForm } = useDisclosure();
  const [newColumnFormName, setNewColumnFormName] = useState<string>("");
  const [newColumnFormParentId, setNewColumnFormParentId] = useState<string>(null);
  const [draggingNodeDataset, setDraggingNodeDataset] = useRecoilState(draggingNodeDatasetState);
  const [currentModalFormErrors, setCurrentModalFormErrors] = useState<string[]>([]); //TODO これ使ってるところ動作確認現状一切してないので要チェック
  // ref
  const newTopLevelColumnSpaceFormRef = React.useRef(null);
  const newColumnSpacesFormRefs = React.useRef([]);
  const columnNameRefs = React.useRef([]);
  const newColumnNameInputRefs = React.useRef([]);
  const newColumnFormRef = React.useRef(null);
  const lastAddedBorderElementRef = React.useRef(null);
  const isLeavingToParentColumnSpace = React.useRef(null);
  const lastFilledColumnSpaceNodeRef = React.useRef(null);

  /* -----------------------------------------------------一般----------------------------------------------------------- */

  const handleTreeNodeToggle = useCallback((event, expandedNodeIds) => {
    console.debug("ツリービュー展開のトグル");
    setExpandedColumnSpaces(expandedNodeIds);
  }, [expandedColumnSpaces]);

  const handleClickColumn = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラム左クリック");
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
              console.log(e.stack);
            }
          }
        });
      },
      handleClickAddChildColumnSpace: async () => {
        newColumnSpacesFormRefs.current[targetDataset.id].classList.remove("hidden");
        newColumnSpacesFormRefs.current[targetDataset.id].elements.namedItem("new-column-space-name").focus();
      },
      handleClickAddChildColumn: async () => {
        setNewColumnFormParentId(targetDataset.id);
        openNewColumnForm();
        newColumnFormRef.current.elements.namedItem("column-name").focus();
      },
      targetColumnSpaceDataset: targetDataset,
    });
  }, []);

  const handleRightClickOnColumn = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラムのコンテキストメニュー表示");
    event.preventDefault();
    event.stopPropagation();
    const targetDataset = (event.target as HTMLElement).parentElement.parentElement.parentElement.dataset;
    setSelectedNodeId(targetDataset.id);
    setSelectedColumnDataset(targetDataset);
    showColumnContextMenu(event, {
      handleClickCreateNewCell: () => {
        openNewCellFormOpen();
      },
      handleClickRenameColumn: () => {
        columnNameRefs.current[targetDataset.id].classList.add("hidden");
        newColumnNameInputRefs.current[targetDataset.id].classList.remove("hidden");
        newColumnNameInputRefs.current[targetDataset.id].elements.namedItem("new-column-name").value = targetDataset.name;
        setImmediate(() => newColumnNameInputRefs.current[targetDataset.id].elements.namedItem("new-column-name").focus())
      },
      handleClickDeleteColumn: async () => {
        remote.dialog.showMessageBox({
          type: 'info',
          buttons: ['はい', "いいえ"],
          title: 'カラムの削除',
          message: 'カラムの削除',
          detail: `${targetDataset.name}を削除しますか？`,
        }).then(async (res) => {
          if (res.response === 0) { //「はい」を選択した時
            try {
              const newColumnSpaces = await removeColumnUseCase(targetDataset.id);
              setColumnSpaces(newColumnSpaces);
            } catch (e) {
              console.log(e.stack);
            }
          }
        });
      },
    });
  }, []);

  const handleRightClickOnEmptySpace = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("エクスプローラーの無部分押下時のコンテキストメニュー表示");
    event.preventDefault();
    event.stopPropagation();

    showEmptySpaceContextMenu(event, {
      handleClickAddColumnSpace: () => {
        newTopLevelColumnSpaceFormRef.current.classList.remove("hidden");
        setImmediate(() => newTopLevelColumnSpaceFormRef.current.elements.namedItem("new-column-space-name").focus());
      }
    });
  }, []);

  /* -----------------------------------------------------各種フォーム管理----------------------------------------------------------- */

  const handleClickAddColumnSpaceButton = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラムスペース追加ボタン押下");
    event.preventDefault();
    newTopLevelColumnSpaceFormRef.current.classList.remove("hidden");
    setImmediate(() => newTopLevelColumnSpaceFormRef.current.elements.namedItem("new-column-space-name").focus())
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
      console.log(e.stack);
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
      setExpandedColumnSpaces((previousExpandedColumnSpaces) => {
        return Array.from(new Set([...previousExpandedColumnSpaces, columnSpaceId]));
      });
    } catch (e) {
      console.log(e.stack);
    } finally {
      newColumnSpacesFormRefs.current[columnSpaceId].elements.namedItem("new-column-space-name").value = null;
    }
  }, []);

  const handleSubmitNewColumnName = useRecoilCallback(({set}) => async (event: React.FormEvent<HTMLFormElement>, columnId: string) => {
    console.debug("カラム名変更フォームsubmit");
    event.preventDefault();

    const newColumnName = newColumnNameInputRefs.current[columnId].elements.namedItem("new-column-name").value;
    /// 表示状態管理
    newColumnNameInputRefs.current[columnId].classList.add("hidden");
    newColumnNameInputRefs.current[columnId].elements.namedItem("new-column-name").blur();
    newColumnNameInputRefs.current[columnId].elements.namedItem("new-column-name").value = null;
    columnNameRefs.current[columnId].classList.remove("hidden");

    try {
      // 指定IDのカラムスペースの子に新しいカラムスペースを追加
      const newColumnSpaces = await renameColumnUseCase(columnId, newColumnName);
      set(columnSpacesState, newColumnSpaces);
    } catch (e) {
      console.log(e.stack);
    }
  }, []);

  /* -----------------------------------------------------カラム新規作成モーダルの管理----------------------------------------------------------- */

  const handleClickCreateNewColumn = useCallback(async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラム新規作成モーダルの作成ボタン押下");
    try {
      const newColumnSpaces = await createColumnUseCase(
        new TrimedFilledString(newColumnFormRef.current.elements.namedItem("column-name").value),
        newColumnFormParentId,
        newColumnFormRef.current.elements.namedItem("column-type").value,
      );
      setColumnSpaces(newColumnSpaces);
      setExpandedColumnSpaces((previousExpandedColumnSpaces) => {
        return Array.from(new Set([...previousExpandedColumnSpaces, newColumnFormParentId]));
      });
      closeNewColumnForm();
    } catch (e) {
      console.log(e.stack);
      setCurrentModalFormErrors([e.message]);
    } finally {
      setNewColumnFormName("");
    }
  }, [newColumnFormParentId, expandedColumnSpaces])

  const handleChangeNewColumnNameInput = useCallback((event) => {
    console.debug("カラム新規作成モーダルのカラム名インプットのonchange");
    setNewColumnFormName(event.target.value);
    setCurrentModalFormErrors([]);
  }, []);

  const handleClickNewColmnFormClose = useCallback((event) => {
    console.debug("カラム新規作成モーダルのキャンセル");
    closeNewColumnForm();
    setCurrentModalFormErrors([]);
  }, []);

  /* -----------------------------------------------------セル新規作成モーダルの管理----------------------------------------------------------- */

  const handleNewCellFormCreateButtonClick = useRecoilCallback(({set}) => async (columnDataset: ColumnDataset, formData: any) => {
    console.debug("新しいセルフォームの作成ボタン押下");

    try {
      const newColumnSpaces = await createCellUseCase(columnDataset, formData);
      // set(columnSpacesState, newColumnSpaces);
      closeNewCellForm();
    } catch (e) {
      console.log(e.stack);
      setCurrentModalFormErrors([e.message]);
    }

  }, []);

  const handleNewCellFormClose = useCallback((event) => {
    console.debug("カラム新規作成モーダルのキャンセル");
    closeNewCellForm();
    setCurrentModalFormErrors([]);
  }, []);

  const handleNewCellFormCloseButtonClick = useCallback((event) => {
    console.debug("カラム新規作成モーダルのキャンセル");
    closeNewCellForm();
    setCurrentModalFormErrors([]);
  }, []);

  /* -----------------------------------------------------カラムスペースのDnD----------------------------------------------------------- */

  const handleDropOnEmptySpace = useRecoilCallback(({set}) => async(event: React.DragEvent<HTMLElement>) => {
    console.debug("emptyスペースへのドロップ");

    // カラムスペースをトップレベルに移動する
    try {
      const newColumnSpaces = await moveColumnSpaceToTopLevelUseCase(event.dataTransfer.getData("columnSpaceId"));
      setColumnSpaces(newColumnSpaces);
    } catch (e) {
      console.log(e.stack);
    } finally {
      set(draggingNodeDatasetState, null);
    }
  }, []);

  const handleDragOverOnEmptySpace = useCallback((event) => {
    // console.debug("emptyスペースへのドラッグオーバー");
    event.preventDefault(); //NOTE: DragOverにてpreventDefaultしないとdropが発火しないため記述
  }, []);

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

    /// カラムスペースをDnDでの移動の管理
    if (draggingNodeDataset && Number(draggingNodeDataset.type) === FileSystemEnum.ColumnSpace) {
      const currentColumnSpaces = await snapshot.getPromise(columnSpacesState);
      const targetColumnSpace = currentColumnSpaces.findDescendantColumnSpace(enteredColumnSpaceDataset.id);
      if (draggingNodeDataset.id !== enteredColumnSpaceDataset.id && targetColumnSpace.canAddColumnSpace()) {
        // カラムスペースをドラッグしており、ドラッグエンターした相手が自身ではなく、かつドロップ可能なカラムスペースな場合
        enteredColumnSpace.classList.add("bg-gray-900");
        lastFilledColumnSpaceNodeRef.current = enteredColumnSpace;
      } else {
        if (lastFilledColumnSpaceNodeRef.current) {
          lastFilledColumnSpaceNodeRef.current.classList.remove("bg-gray-900");
        }
      }
    }

    /// カラムをDnDでのソートの管理
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

  }, []);

  const handleDragOverOnColumnSpace = useCallback((event) => {
    // console.debug("カラムスペースへのドラッグオーバー");
    event.preventDefault(); //NOTE: DragOverにてpreventDefaultしないとdropが発火しないため記述
  }, []);


  const handleDragLeaveOnColumnSpace = useCallback((event) => {
    // console.debug("カラムスペースへのドラッグリーブ");
    event.preventDefault(); //NOTE: DragOverにてpreventDefaultしないとdropが発火しないため記述
    isLeavingToParentColumnSpace.current = false;

    const leavedNode = (event.target as HTMLElement);
    leavedNode.classList.remove("bg-gray-900");
  }, []);

  const handleDropOnColumnSpace = useRecoilCallback(({snapshot, set}) => async(event: React.DragEvent<HTMLElement>) => {
    console.debug("カラムスペースへのドロップ");
    event.preventDefault();
    event.stopPropagation();

    /// 色付けの管理
    if (lastFilledColumnSpaceNodeRef.current) {
      lastFilledColumnSpaceNodeRef.current.classList.remove("bg-gray-900");
    }
    if (lastAddedBorderElementRef.current) {
      lastAddedBorderElementRef.current.classList.remove("border-t-2");
      lastAddedBorderElementRef.current.classList.remove("border-b-2");
    }

    /// カラムのソート管理
    const draggingNodeDataset = await snapshot.getPromise(draggingNodeDatasetState);
    if (draggingNodeDataset.type == FileSystemEnum.Column) {

      if (draggingNodeDataset.columnSpaceId == (event.target as HTMLElement).dataset.id) {
        // 親ならカラムをソートをする
        try {
          const newColumnSpaces = await changeColumnOrderUseCase(draggingNodeDataset.columnSpaceId, draggingNodeDataset.id);
          setColumnSpaces(newColumnSpaces);
        } catch(e) {
          console.log(e.stack);
        }
      }

      set(draggingNodeDatasetState, null);
      return;
    }

    /// カラムスペースを移動する
    try {
      const fromId = event.dataTransfer.getData("columnSpaceId");
      const toId = (event.target as HTMLElement).dataset.id;
      const newColumnSpaces = await moveColumnSpaceUseCase(fromId, toId);
      setColumnSpaces(newColumnSpaces);
      setExpandedColumnSpaces((previousExpandedColumnSpaces) => {
        return Array.from(new Set([...previousExpandedColumnSpaces, toId]));
      });
    } catch (e) {
      console.log(e.stack);
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

    /// 色付け管理
    const leavedNode = (event.target as HTMLElement);
    const leavdNodeDataset = leavedNode.parentElement.parentElement.parentElement.dataset;
    if (leavdNodeDataset.addedBorder === "true") {
      leavedNode.classList.remove("border-b-2");
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
    event.preventDefault();
    event.stopPropagation();

    const draggingNodeDataset = await snapshot.getPromise(draggingNodeDatasetState)
    const targetColumnDataset = (event.target as HTMLElement).parentElement.parentElement.parentElement.dataset;
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

    /// カラムのソート
    try {
      const newColumnSpaces = await changeColumnOrderUseCase(targetColumnDataset.columnSpaceId, draggingNodeDataset.id, targetColumnDataset.id);
      setColumnSpaces(newColumnSpaces);
    } catch(e) {
      console.log(e.stack);
    }
  }, []);

  /* -----------------------------------------------------キーイベント----------------------------------------------------------- */

  const hanleKeyDownOnColumn = useCallback((event: React.KeyboardEvent) => {
    console.debug("選択されてるカラムにキーダウン");

    //TODO 「A component is changing the controlled selected state of TreeView to be uncontrolled」というwarningがたまに出るのでもしこれが問題ならf2で名前変更機能は一旦諦めて、そのコード全消しして。キャッチで握りつぶせるならして。もしかしたらinputのvalueをsetStateで管理したらいける可能性はあり
    if (event.key === "F2") {
      const target = (event.target as HTMLElement);
      const targetDataset = target.dataset;

      columnNameRefs.current[targetDataset.id].classList.add("hidden");
      newColumnNameInputRefs.current[targetDataset.id].classList.remove("hidden");
      newColumnNameInputRefs.current[targetDataset.id].elements.namedItem("new-column-name").value = targetDataset.name;
      setImmediate(() => newColumnNameInputRefs.current[targetDataset.id].elements.namedItem("new-column-name").focus())
    }
  }, []);


  /* -----------------------------------------------------他----------------------------------------------------------- */

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
    selectedColumnDataset,
    isNewColumnFormOpen,
    isNewCellFormOpen,
    newColumnFormName,
    currentModalFormErrors,
    //ref
    newTopLevelColumnSpaceFormRef,
    newColumnFormRef,
    newColumnSpacesFormRefs,
    newColumnNameInputRefs,
    columnNameRefs,
    //イベントハンドラ
    hanleKeyDownOnColumn,
    handleTreeNodeToggle,
    handleSubmitTopLevelNewColumnSpaceForm,
    handleSubmitNewColumnSpaceForm,
    handleSubmitNewColumnName,
    handleChangeNewColumnNameInput,
    handleClickAddColumnSpaceButton,
    handleClickNewColmnFormClose,
    handleClickCreateNewColumn,
    handleClickColumn,
    handleRightClickOnEmptySpace,
    handleRightClickOnColumnSpace,
    handleRightClickOnColumn,
    handleDragOverOnEmptySpace,
    handleDragStartOnColumnSpace,
    handleDragEnterOnColumnSpace,
    handleDragOverOnColumnSpace,
    handleDragLeaveOnColumnSpace,
    handleDragOverOnColumn,
    handleDragStartOnColumn,
    handleDragEnterOnColumn,
    handleDragLeaveOnColumn,
    handleDropOnEmptySpace,
    handleDropOnColumnSpace,
    handleDropOnColumn,
    handleNewCellFormClose,
    handleNewCellFormCreateButtonClick,
    handleNewCellFormCloseButtonClick,
    //他
    openNewCellFormOpen,
    closeNewColumnForm,
  }
}