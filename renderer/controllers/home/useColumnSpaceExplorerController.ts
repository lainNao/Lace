import React, { useCallback, useState} from 'react';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import columnSpacesState from '../../recoils/atoms/columnSpacesState';
import { FileSystemEnum } from "../../resources/enums/app"
import { createTopLevelColumnSpaceUsecase } from '../../usecases/createTopLevelColumnSpaceUsecase';
import { moveColumnSpaceUsecase } from '../../usecases/moveColumnSpaceUsecase';
import { showColumnContextMenu } from '../../context-menus/showColumnContextMenu';
import { showColumnSpaceContextMenu } from '../../context-menus/showColumnSpaceContextMenu';
import { showEmptySpaceContextMenu } from '../../context-menus/showEmptySpaceContextMenu';
import { remote } from "electron"
import useSetupColumnSpaces from '../../hooks/useSetupColumnSpaces';
import { removeColumnSpaceUsecase } from '../../usecases/removeColumnSpaceUsecase';
import useSetupSettings from '../../hooks/useSetupSettings';
import { createDescendantColumnSpaceUsecase } from '../../usecases/createDescendantColumnSpaceUsecase';
import { TrimedFilledString } from '../../value-objects/TrimedFilledString';
import { createColumnUsecase } from '../../usecases/createColumnUsecase';
import { useDisclosure } from '@chakra-ui/react';
import draggingNodeDatasetState from '../../recoils/atoms/ColumnSpaceExplorer/draggingNodeDatasetState';
import { updateColumnOrderUsecase } from '../../usecases/updateColumnOrderUsecase';
import { moveColumnSpaceToTopLevelUsecase } from '../../usecases/moveColumnSpaceToTopeLevelUsecase';
import { removeColumnUsecase } from '../../usecases/removeColumnUsecase';
import { renameColumnUsecase } from '../../usecases/renameColumnUsecase';
import { ColumnDataset } from '../../resources/types';
import { useToast } from "@chakra-ui/react"
import { createCellsUsecase } from '../../usecases/createCellsUsecase';
import specificColumnSpaceState from '../../recoils/selectors/specificColumnSpaceState';
import selectedColumnSpaceIdState from "../../recoils/atoms/selectedColumnSpaceIdState"
import { CellRelationFormData } from '../../pages.partial/home/ColumnSpaceExplorer.partial/CellRelationModal';
import relatedCellsState from '../../recoils/atoms/relatedCellsState';
import { dispatchCellRelationModalSubmit } from '../../usecases/dispatchCellRelationModalSubmit';
import { CellDataType } from '../../resources/CellDataType';
import displaySettingsState from '../../recoils/atoms/displaySettingsState';


//TODO 結局useCallbackの第二引数使えないじゃんってなって、そこに追加してるけど意味ないの消しちゃったりしたんだけど、実際どう使うのが正解なの？調べて。それによってはgetPromise(～)は使わなくなる
//TODO おそらく、「inputを出したまま右側で編集する」とかなるとバグるかもしれないので、そこを一応留意しておきたい。逆に右側で編集中に左側いじっても同じことになる可能性あり。フラグを足すことになるかも

//NOTE: 基本的にコントローラーでカラムスペースを扱う時はidだけで扱う。責務的に。
export const useColumnSpaceExplorerController = () => {
  // メタ状態類
  const [columnSpaces, setColumnSpaces] = useSetupColumnSpaces();           //TODO これhome.tsxでやってるからもう不要で、useRecoilStateに変えたほうがいいのでは
  const [relatedCells, setRelatedCells] = useRecoilState(relatedCellsState);
  const [displaySettings, setDisplaySettings] = useRecoilState(displaySettingsState);
  // UI状態類
  const [expandedColumnSpaces, setExpandedColumnSpaces] = useSetupSettings();
  const [selectedNodeId, setSelectedNodeId] = useState<string>(null);
  const [cellmanagerModalData, setCellManagerModalData] = useState<{columnSpaceId: string, columnId: string, columnType: CellDataType, columnName: string}>(null);
  const [newColumnFormName, setNewColumnFormName] = useState<string>("");
  const [newColumnFormParentId, setNewColumnFormParentId] = useState<string>(null);
  const [draggingNodeDataset, setDraggingNodeDataset] = useRecoilState(draggingNodeDatasetState);
  const currentSelectedColumnSpaceId = useRecoilValue(selectedColumnSpaceIdState);
  const currentSelectedColumnSpace = useRecoilValue(specificColumnSpaceState(currentSelectedColumnSpaceId));  //TODO これ、モーダル内に隠蔽したほうがいいのでは。毎回発火しなくていいし
  // モーダル管理
  const { isOpen: isNewColumnFormOpen, onOpen: openNewColumnForm, onClose: closeNewColumnForm } = useDisclosure();
  const { isOpen: isNewCellFormOpen, onOpen: openNewCellFormOpen, onClose: closeNewCellForm } = useDisclosure();
  const { isOpen: isCellRelationFormOpen, onOpen: openCellRelationFormOpen, onClose: closeCellRelationForm } = useDisclosure();
  const { isOpen: isDisplaySettingModalOpen, onOpen: openDisplaySettingModal, onClose: closeDisplaySettingModal } = useDisclosure();
  // ref
  const newTopLevelColumnSpaceFormRef = React.useRef(null);
  const newColumnSpacesFormRefs = React.useRef([]);
  const columnNameRefs = React.useRef([]);
  const newColumnNameInputRefs = React.useRef([]);
  const newColumnFormRef = React.useRef(null);
  const lastAddedBorderElementRef = React.useRef(null);
  const isLeavingToParentColumnSpace = React.useRef(null);
  const lastFilledColumnSpaceNodeRef = React.useRef(null);
  // 他
  const toast = useToast()

  /* -----------------------------------------------------一般----------------------------------------------------------- */

  const handleTreeNodeToggle = useCallback((event, expandedNodeIds: string[]) => {
    console.debug("ツリービュー展開のトグル");
    setExpandedColumnSpaces(expandedNodeIds);
  }, []);

  const handleClickColumn = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラム左クリック");
    event.preventDefault();
    event.stopPropagation();

    const targetDataset = (event.target as HTMLElement).parentElement.parentElement.parentElement.dataset;
    setSelectedNodeId(targetDataset.id);
  }, []);

  const handleClickColumnSpace = useRecoilCallback(({snapshot, set}) => async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラムスペースの左クリック");

    /// エクスプローラにて子カラムがあるカラムスペースを左クリックしたら、それをcurrentColumnSpaceとしてatomsに反映
    // TODO これはlocalStorageにも保存するかな（同じことをできるのを右クリメニューにも作るか…）
    const targetDataset = (event.target as HTMLElement).dataset;
    set(selectedColumnSpaceIdState, targetDataset.id);
  }, []);

  /* -----------------------------------------------------コンテキストメニュー管理----------------------------------------------------------- */

  const handleRightClickOnColumnSpace = useRecoilCallback(({set}) => async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラムスペースのコンテキストメニュー表示");
    event.preventDefault();
    event.stopPropagation();

    const targetDataset = (event.target as HTMLElement).dataset;
    setSelectedNodeId(targetDataset.id);
    set(selectedColumnSpaceIdState, targetDataset.id);

    showColumnSpaceContextMenu(event, {
      handleClickAddChildColumnSpace: async () => {
        newColumnSpacesFormRefs.current[targetDataset.id].classList.remove("hidden");
        newColumnSpacesFormRefs.current[targetDataset.id].elements.namedItem("new-column-space-name").focus();
      },
      handleClickDisplaySettings: async () => {
        set(selectedColumnSpaceIdState, targetDataset.id);
        openDisplaySettingModal();
      },
      handleClickAddChildColumn: async () => {
        setNewColumnFormParentId(targetDataset.id);
        openNewColumnForm();
        newColumnFormRef.current.elements.namedItem("column-name").focus();
      },
      handleClickRelateCells: async () => {
        openCellRelationFormOpen();
      },
      handleClickDeleteColumnSpace: async () => {
        remote.dialog.showMessageBox({
          type: 'question',
          buttons: ["いいえ", 'はい'],
          message: 'カラムスペースの削除',
          detail: `${targetDataset.name}を削除しますか？`,
          noLink: true,
        }).then(async (res) => {
          if (res.response === 1) { //「はい」を選択した時
            try {
              const [newColumnSpaces, newRelatedCells, newDisplaySettings] = await removeColumnSpaceUsecase(targetDataset.id);
              setColumnSpaces(newColumnSpaces);
              setRelatedCells(newRelatedCells);
              setDisplaySettings(newDisplaySettings);
            } catch (e) {
              console.log(e.stack);
              toast({ title: e.message, status: "error", position: "bottom-right", isClosable: true, duration: 10000,})
            }
          }
        });
      },
      targetColumnSpaceDataset: targetDataset,
    });
  }, []);

  const handleRightClickOnColumn = useRecoilCallback(({snapshot}) => async(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラムのコンテキストメニュー表示");
    event.preventDefault();
    event.stopPropagation();
    const targetDataset = (event.target as HTMLElement).parentElement.parentElement.parentElement.dataset.id    //NOTE: htmlの構造的に右クリされるのがパターンあるのでこうなってしまってる
      ? (event.target as HTMLElement).parentElement.parentElement.parentElement.dataset
      : (event.target as HTMLElement).parentElement.parentElement.parentElement.parentElement.dataset

    if (!targetDataset.id) {
      return;
    }

    setSelectedNodeId(targetDataset.id);
    showColumnContextMenu(event, {
      handleClickCreateNewCell: async () => {
        console.log(targetDataset)
        const currentRootColumnSpaces = await snapshot.getPromise(columnSpacesState);
        const columnSpace = currentRootColumnSpaces.findDescendantColumnSpace(targetDataset.columnSpaceId);
        const column = currentRootColumnSpaces.findDescendantColumn(targetDataset.id);
        setCellManagerModalData({
          columnSpaceId: columnSpace.id,
          columnId: column.id,
          columnType: column.type,
          columnName: column.name,
        })
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
          type: 'question',
          buttons: ["いいえ", 'はい'],
          message: 'カラムの削除',
          detail: `${targetDataset.name}を削除しますか？`,
          noLink: true,
        }).then(async (res) => {
          if (res.response === 1) { //「はい」を選択した時
            try {
              const [newColumnSpaces, newRelatedCells, newDisplaySettings] = await removeColumnUsecase(targetDataset.columnSpaceId, targetDataset.id);
              setColumnSpaces(newColumnSpaces);
              setRelatedCells(newRelatedCells);
              setDisplaySettings(newDisplaySettings);
            } catch (e) {
              console.log(e.stack);
              toast({ title: e.message, status: "error", position: "bottom-right", isClosable: true, duration: 10000,})
            }
          }
        });
      },
    });
  }, []);

  const handleRightClickOnEmptySpace = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    // if (!(event.target as HTMLElement)?.dataset?.isEmptySpace) {
    //   return;
    // }

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
      const newColumnSpaces = await createTopLevelColumnSpaceUsecase(newColumnSpaceName);
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
      const newColumnSpaces = await createDescendantColumnSpaceUsecase(columnSpaceId, newColumnSpaceName);
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
      const newColumnSpaces = await renameColumnUsecase(columnId, newColumnName);
      set(columnSpacesState, newColumnSpaces);
    } catch (e) {
      console.log(e.stack);
    }
  }, []);

  const handleSubmitCellRelationForm = useRecoilCallback(({set}) => async (cellRelationFormData: CellRelationFormData, columnSpaceId: string) => {
    console.debug("カラム関連付けフォームsubmit", cellRelationFormData);

    try {
      const newRelatedCells = await dispatchCellRelationModalSubmit(columnSpaceId, cellRelationFormData);
      set(relatedCellsState, newRelatedCells);
      toast({
        title: "関連セルを更新しました",
        status: "success",
        position: "bottom-right",
        isClosable: true,
        duration: 1500,
      })
    } catch (e) {
      console.log(e.stack);
      toast({
        title: e.message,
        status: "error",
        position: "bottom-right",
        isClosable: true,
        duration: 10000,
      })
    }
  }, []);

  /* -----------------------------------------------------カラム新規作成モーダルの管理----------------------------------------------------------- */

  const handleClickCreateNewColumn = useCallback(async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.debug("カラム新規作成モーダルの作成ボタン押下");
    try {
      const newColumnSpaces = await createColumnUsecase(
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
      toast({
        title: e.message,
        status: "error",
        position: "bottom-right",
        isClosable: true,
        duration: 10000,
      })
    } finally {
      setNewColumnFormName("");
    }
  }, [newColumnFormParentId, expandedColumnSpaces])

  const handleChangeNewColumnNameInput = useCallback((event) => {
    console.debug("カラム新規作成モーダルのカラム名インプットのonchange");
    setNewColumnFormName(event.target.value);
  }, []);

  const handleClickNewColmnFormClose = useCallback((event) => {
    console.debug("カラム新規作成モーダルのキャンセル");
    closeNewColumnForm();
  }, []);

  /* -----------------------------------------------------セル新規作成モーダルの管理----------------------------------------------------------- */

  const handleNewCellFormCreateButtonClick = useRecoilCallback(({set}) => async (columnDataset: ColumnDataset, formData: any, successMessage?: string) => {
    console.debug("新しいセルを作成するフォームの登録ボタン押下");

    try {
      const newColumnSpaces = await createCellsUsecase(columnDataset.columnSpaceId, columnDataset.id, columnDataset.columnType, formData);
      set(columnSpacesState, newColumnSpaces);
      toast({
        title: successMessage ?? "セルを追加しました",
        status: "success",
        position: "bottom-right",
        isClosable: true,
        duration: 1500,
      })
    } catch (e) {
      console.log(e.stack);
      toast({
        title: e.message,
        status: "error",
        position: "bottom-right",
        isClosable: true,
        duration: 10000,
      })
    }

  }, []);

  const handleNewCellFormClose = useCallback((event) => {
    console.debug("カラム新規作成モーダルのキャンセル");
    closeNewCellForm();
  }, []);

  const handleNewCellFormCloseButtonClick = useCallback((event) => {
    console.debug("カラム新規作成モーダルのキャンセル");
    closeNewCellForm();
  }, []);

  /* -----------------------------------------------------カラムスペースのDnD----------------------------------------------------------- */

  const handleDropOnEmptySpace = useRecoilCallback(({set}) => async(event: React.DragEvent<HTMLElement>) => {
    console.debug("emptyスペースへのドロップ");
    const columnSpaceId = event.dataTransfer.getData("columnSpaceId");

    if (!columnSpaceId) {
      return;
    }

    // カラムスペースをトップレベルに移動する
    try {
      const newColumnSpaces = await moveColumnSpaceToTopLevelUsecase(columnSpaceId);
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
          const newColumnSpaces = await updateColumnOrderUsecase(draggingNodeDataset.columnSpaceId, draggingNodeDataset.id);
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
      const newColumnSpaces = await moveColumnSpaceUsecase(fromId, toId);
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
      const newColumnSpaces = await updateColumnOrderUsecase(targetColumnDataset.columnSpaceId, draggingNodeDataset.id, targetColumnDataset.id);
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


  return {
    //データ
    columnSpaces,
    relatedCells,
    displaySettings,
    currentSelectedColumnSpace,
    expandedColumnSpaces,
    selectedNodeId,
    cellmanagerModalData,
    newColumnFormName,
    //モーダル状態
    isNewColumnFormOpen,
    isNewCellFormOpen,
    isCellRelationFormOpen,
    isDisplaySettingModalOpen,
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
    handleClickColumnSpace,
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
    handleSubmitCellRelationForm,
    //モーダル管理
    handleNewCellFormClose,
    handleNewCellFormCreateButtonClick,
    handleNewCellFormCloseButtonClick,
    openNewCellFormOpen,
    closeNewColumnForm,
    closeCellRelationForm,
    closeDisplaySettingModal,
  }
}