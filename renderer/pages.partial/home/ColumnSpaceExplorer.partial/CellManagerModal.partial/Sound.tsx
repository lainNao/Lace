import React, { useCallback, useState } from 'react';
import { CellManagerModalBodyProps } from "../../ColumnSpaceExplorer";
import { useDropzone } from 'react-dropzone';
import { hasCompatibleSoundExtension } from "../../../../modules/validator";
import { Button, useToast, useDisclosure } from "@chakra-ui/react"
import InfiniteScroll from "react-infinite-scroll-component";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { SoundCellData } from "../../../../models/ColumnSpaces/CellData.implemented";
import { useWindowHeight } from '@react-hook/window-size'
import { useRef } from "react";
import { showCellContextMenu } from "../../../../context-menus/showCellContextMenu";
import { remote } from "electron";
import { removeCellUsecase } from "../../../../usecases/removeCellUsecase";
import columnSpacesState from "../../../../recoils/atoms/columnSpacesState";
import relatedCellsState from "../../../../recoils/atoms/relatedCellsState";
import { FileCellBaseInfo, FileRenameModal } from "./UpdateCellModal/FileRename"
import { CellDataType } from "../../../../resources/CellDataType";
import { ParticularCellRelationModal } from "./ParticularCellRelationModal";
import { Cell } from '../../../../models/ColumnSpaces';
import specificColumnSpaceState from '../../../../recoils/selectors/specificColumnSpaceState';
import { CellViewer } from '../../../../components/CellViewer';
import { getAncestorDataset } from '../../../../modules/element';

//TODO 同階層のTextと同じような感じに変更する
export const CellManagerModalBodySound: React.FC<CellManagerModalBodyProps> = (props) => {

  const currentColumnSpace = useRecoilValue(specificColumnSpaceState(props.columnSpaceId));
  const currentColumn = currentColumnSpace.findDescendantColumn(props.columnId);
  const [paths, setPaths] = useState([]);
  const toast = useToast()
  const windowHeight = useWindowHeight()
  const [updateTargetCellData, setUpdateTargetCellData] = useState<FileCellBaseInfo>(null);
  const { isOpen: isOpenUpdateModal, onOpen: openUpdateModal, onClose: onCloseUpdateModal } = useDisclosure();
  const rightClickedCellRef = useRef(null);
  const [relationTargetCell, setRelationTargetCell] = useState<Cell>(null);
  const { isOpen: isOpenParticularCellRelationModal, onOpen: openParticularCellRelationModal, onClose: onCloseParticularCellRelationModal } = useDisclosure();
  const lastPlayedAudioDetails = useRef(null);

  const handleOnCellContextMenu = useRecoilCallback(({set}) => async(event: React.MouseEvent<HTMLElement> ) => {
    const target = event.target as HTMLElement;
    const dataset = getAncestorDataset(target, "cellId");
    if (!dataset) {
      return;
    }

    rightClickedCellRef.current = target.parentElement;
    rightClickedCellRef.current.classList.add("bg-gray-800");

    showCellContextMenu(event, {
      handleClickRenameCell: async () => {
        setUpdateTargetCellData({
          columnSpaceId: currentColumnSpace.id,
          columnId: currentColumn.id,
          cellId: dataset.cellId,
          type: CellDataType.Sound,
          data: {
            path: dataset.path,
            alias: dataset.alias,
          }
        });
        openUpdateModal();
      },
      handleClickUpdateRelation: async() => {
        const cell = currentColumn.findCell(dataset.cellId);
        setRelationTargetCell(cell);
        openParticularCellRelationModal();
      },
      handleClickDeleteCell: async () => {
        rightClickedCellRef.current.classList.add("bg-gray-800");
        remote.dialog.showMessageBox({
          type: 'question',
          buttons: ["いいえ", 'はい'],
          message: '削除',
          detail: `以下を削除しますか？\n\n${dataset.alias}`,
          noLink: true,
        }).then(async (res) => {
          if (res.response === 1) { //「はい」を選択した時
            const croppedValue = (dataset.alias.length > 15) ? dataset.alias.substring(0, 15)+"..." : dataset.alias;
            try {
              // セルの削除
              // TODO 一個も削除に成功してないときでも例外起きず、成功したことになっているので、そこらへんやっぱどうにかしたほうが良いと思う。例えばtargetCellIdをundefined送っても失敗がわからない
              const [newColumnSpaces, newRelatedCells] = await removeCellUsecase(currentColumnSpace.id, currentColumn.id, dataset.cellId);
              set(columnSpacesState, newColumnSpaces);
              set(relatedCellsState, newRelatedCells);
              toast({ title: `"${croppedValue}"を削除しました`, status: "success", position: "bottom-right", isClosable: true, duration: 1500,})
            } catch (e) {
              toast({ title: e.message, status: "error", position: "bottom-right", isClosable: true, duration: 10000,})
              console.log(e.stack)
            }
            rightClickedCellRef.current.classList.remove("bg-gray-800");
          } else {
            rightClickedCellRef.current.classList.remove("bg-gray-800");
          }
        });
      },
      handleMenuWillClose: async () => {
        rightClickedCellRef.current.classList.remove("bg-gray-800");
      }
    });

  }, [currentColumnSpace, currentColumn])

  const onDrop = useCallback(acceptedFiles => {
    // 対応する拡張子
    const acceptedFilePaths = Array.from<File>(acceptedFiles)
      .map(file => file.path)
      .filter(filepath => hasCompatibleSoundExtension(filepath));

    if (acceptedFiles.length !== acceptedFilePaths.length) {
      toast({
        title: "未対応の拡張子のファイルは取り込みませんでした", //TODO ここ不親切感あるので最終的にどうにかしたい
        status: "error",
        position: "bottom-right",
        isClosable: true,
        duration: 10000,
      });
    }

    setPaths(prev => [...prev, ...acceptedFilePaths])
  }, []);
  const { getRootProps, isDragActive } = useDropzone({onDrop});

  const handleSubmit = useCallback((e) => { //TODO 型
    e.preventDefault();
    e.stopPropagation();
    props.onClickCreateNewCell({
      columnSpaceId: currentColumnSpace.id,
      id: currentColumn.id,
      columnType: currentColumn.type,
    }, paths);
    //TODO 以下、成功したときのみ行いたい
    setPaths([]);
  }, [paths, currentColumnSpace, currentColumn]);

  const handleSoundPlay = (event) => {
    console.debug("Soundセルをplay");
    // 既に再生しているものがあったら、自分じゃないなら停止
    if (lastPlayedAudioDetails.current && (lastPlayedAudioDetails.current.querySelector("audio").dataset.cellId !== event.target.dataset.cellId)) {
      lastPlayedAudioDetails.current.querySelector("audio").pause();
    }

    // 自分を再生中にする
    lastPlayedAudioDetails.current = event.target.parentElement.parentElement;
  }

  const handleSoundPause = (event) => {
    console.debug("Soundセルをpause");

    //NOTE: 切り替える時に 新しいのをplay -> 古いのをpauseの順番に入ってしまい再生してても直後に必ずnullが入ってしまうので、以下は行わない
    // lastPlayedAudioDetails.current = null;
  }

  const handleSoundCellToggle = (event) => {
    const target = event.target;

    /// 閉じた場合
    if (target.dataset.isOpening == "true") {
      console.debug("Soundセルをトグルでclose");
      target.dataset.isOpening = "false";

      // 既に再生しているものがあったら、自分なら停止
      if (lastPlayedAudioDetails.current && (lastPlayedAudioDetails.current.querySelector("audio").dataset.cellId === target.querySelector("audio").dataset.cellId)) {
        lastPlayedAudioDetails.current.querySelector("audio").pause();
      }
      return;
    }

    /// 開いた場合場合
    console.debug("Soundセルをトグルでopen");
    target.dataset.isOpening = "true";

    // 既に再生しているものがあったら、自分じゃないなら停止
    if (lastPlayedAudioDetails.current && (lastPlayedAudioDetails.current.querySelector("audio").dataset.cellId !== target.querySelector("audio").dataset.cellId)) {
      lastPlayedAudioDetails.current.querySelector("audio").pause();
    }

    // 再生開始
    target.querySelector("audio").play();
  }

  //TODO アップロードしようとしたけどやめたファイルを「☓」ボタンで消せるようにする
  //TODO やっぱり音声データはアーティスト名とかで並び替えとかしたいよね…他のセル管理モーダルの一覧部分も、任意のリレーションしてるカラムのリレーションで並び替えできるようにしたいな（リレーションしてないのは「他」みたいに最後に表示するとして）

  return (
    <>
      <div className="flex flex-row">

        {/* アップロードフォーム */}
        <form onSubmit={handleSubmit} className="w-1/2">

          <div {...getRootProps()} className={`${isDragActive ? "border-gray-100" : "border-gray-500"} border-2 border-dashed  rounded-lg flex flex-col p-5`} >
            <div className="text-center">追加したい音声ファイル（mp3、ogg、m4a対応）をこのエリアにドラッグ＆ドロップしてから「登録」ボタンを押せば登録されます。</div>

            {paths.length > 0 &&
            <div className="mt-3 font-thin text-xs">
              <ul>
                {/* TODO このパスの名前切り抜くやつ、OS違うと駄目かもだから留意 */}
                {/* TODO ここでローカルファイルを画像表示するために「webSecurity: false」にしてるので、嫌ならあとでやめる */}
                {/* TODO 再生ボタンを横に一応つけたいところ */}
                {paths.map((filePath, index) => (
                  <li key={index} className="mt-2">
                    {filePath.split("\\").pop()}
                  </li>
                ))}
              </ul>
            </div>
            }
          </div>

          {/* 各種ボタン */}
          <div className="float-right mt-3 mb-2">
            {paths.length > 0 && (
              <div className="inline-block mr-3"><span className="font-black mx-1">{paths.length}</span><span className="text-sm">ファイル</span></div>
            )}
            <Button type="submit" isDisabled={!(paths.length)} colorScheme="blue" mr={3} >登録</Button>
            <Button variant="ghost" onClick={props.handleClickNewCellFormClose}>キャンセル</Button>
          </div>

        </form>

        {/* 一覧 */}
        <div className="w-1/2 pb-3 pr-2 pl-10">

          <div className="mb-2">セル一覧（右クリックで編集/削除）</div>
          {currentColumn.cells.children.length === 0
            ? <div className="outline-none" style={{height: windowHeight-260 +"px"}}>0件</div>
            : <InfiniteScroll
                dataLength={currentColumn.cells.children.length}
                loader={<h4>Loading...</h4>}
                next={null}
                hasMore={false}
                height={windowHeight-260}
              >
                {currentColumn.cells.mapChildren((cell, index) => {
                  const displayName = (cell.data as SoundCellData).alias;
                  return (
                    <div key={cell.id} onContextMenu={handleOnCellContextMenu} data-cell-id={cell.id} data-path={(cell.data as SoundCellData).path}  data-alias={(cell.data as SoundCellData).alias ?? (cell.data as SoundCellData).name} >
                      <hr/>
                      <div key={cell.id} className="break-all hover:bg-gray-800 pb-2 pl-1 whitespace-pre-wrap" style={{minHeight: "10px"}}>
                        <CellViewer
                          key={cell.id}
                          cell={cell}
                          withLiPrefix={false}
                          onSoundCellToggle={handleSoundCellToggle}
                          onSoundCellPlay={handleSoundPlay}
                          onSoundCellPause={handleSoundPause}
                        />
                      </div>
                    </div>
                  )
                })}
              </InfiniteScroll>
          }
          </div>

      </div>

      {/* リネームモーダル */}
      {updateTargetCellData &&
        <FileRenameModal
          isOpen={isOpenUpdateModal}
          onClose={onCloseUpdateModal}
          cellData={updateTargetCellData}
        />
      }

      {/* セルリレーション管理モーダル */}
      {relationTargetCell &&
        <ParticularCellRelationModal
          isOpen={isOpenParticularCellRelationModal}
          onClose={onCloseParticularCellRelationModal}
          onSubmitRelationForm={props.onSubmitRelationForm}
          columnSpace={currentColumnSpace}
          column={currentColumn}
          cell={relationTargetCell}
        />
      }

    </>
  )
}
