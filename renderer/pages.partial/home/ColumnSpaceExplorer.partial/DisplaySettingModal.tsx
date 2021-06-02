import React, { useRef, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useToast, useDisclosure } from "@chakra-ui/react"
import {  DisplaySetting, DisplaySettings } from '../../../models/DisplaySettings';
import { useRecoilValue } from 'recoil';
import selectedColumnSpaceIdState from '../../../recoils/atoms/selectedColumnSpaceIdState';
import { useWindowHeight } from '@react-hook/window-size';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DisplaySettingAddForm } from './DisplaySettingModal.partial';
import { useRecoilCallback } from 'recoil';
import { remote } from 'electron';
import { removeDisplaySettingUsecase } from '../../../usecases/removeDisplaySettingUsecase';
import displaySettingsState from '../../../recoils/atoms/displaySettingsState';
import { showDisplaySettingContextMenu } from '../../../context-menus/showDisplaySettingContextMenu';
import { DisplaySettingUpdateModal } from './DisplaySettingModal.partial/DisplaySettingUpdateModal';

type Props = {
  isOpen: boolean,
  onClose: any, //TODO 何の型
  displaySettings: DisplaySettings,
}

export const DisplaySettingModal: React.FC<Props> = props => {
  const currentSelectedColumnSpaceId = useRecoilValue(selectedColumnSpaceIdState);
  const windowHeight = useWindowHeight()
  const rightClickedCellRef = useRef(null);
  const toast = useToast();
  const [updateTargetDisplaySetting, setUpdateTargetDisplaySetting] = useState<DisplaySetting>();
  const { isOpen: isOpenUpdateModal, onOpen: openUpdateModal, onClose: onCloseUpdateModal } = useDisclosure();

  const handleOnDisplaySettingContextMenu = useRecoilCallback(({set, snapshot}) => async(event: React.MouseEvent<HTMLElement> ) => {
    const target = event.target as HTMLElement;
    const targetDataset = target.parentElement.dataset;

    rightClickedCellRef.current = target.parentElement;
    rightClickedCellRef.current.classList.add("bg-gray-800");

    showDisplaySettingContextMenu({
      handleClickUpdateDisplaySetting: async () => {
        const displaySettings = await snapshot.getPromise(displaySettingsState);
        const targetDisplaySetting = displaySettings.children[currentSelectedColumnSpaceId].find(ds => ds.id === targetDataset.displaySettingId);
        setUpdateTargetDisplaySetting(targetDisplaySetting);
        openUpdateModal();
      },
      handleClickDeleteDisplaySetting: async () => {
        rightClickedCellRef.current.classList.add("bg-gray-800");
        remote.dialog.showMessageBox({
          type: 'question',
          buttons: ["いいえ", 'はい'],
          message: '削除',
          detail: `以下を削除しますか？\n\n${target.innerText}`,
          noLink: true,
        }).then(async (res) => {
          if (res.response === 1) { //「はい」を選択した時
            const croppedValue = (target.innerText.length > 15) ? target.innerText.substring(0, 15)+"..." : target.innerText;
            try {
              // セルの削除
              const newDisplaySettings = await removeDisplaySettingUsecase(currentSelectedColumnSpaceId, targetDataset.displaySettingId);
              set(displaySettingsState, newDisplaySettings);
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
      handleMenuWillClose: () => {
        rightClickedCellRef.current.classList.remove("bg-gray-800");
      }
    })

  }, [currentSelectedColumnSpaceId]);

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size="6xl" closeOnEsc={false} closeOnOverlayClick={false} >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>表示設定</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-row pb-3">

              {/* 表示設定新規追加フォーム */}
              <div className="w-1/2 pl-4 pb-5">
                <DisplaySettingAddForm/>
              </div>

              <div style={{width: "2px"}} className="bg-gray-600 mx-3"></div>

              {/* 一覧 */}
              <div className="w-1/2">
                <div className="mb-2">表示設定一覧（右クリックで編集/削除）</div>
                {!props.displaySettings.children[currentSelectedColumnSpaceId] || props.displaySettings.children[currentSelectedColumnSpaceId].length === 0
                  ? <div className="outline-none" style={{height: windowHeight-260 +"px"}}>0件</div>
                  : <InfiniteScroll
                      dataLength={props.displaySettings.children[currentSelectedColumnSpaceId].length}
                      loader={<h4>Loading...</h4>}
                      next={null}
                      hasMore={false}
                      height={windowHeight-260}
                    >
                      {props.displaySettings.children[currentSelectedColumnSpaceId].map((displaySetting, index) => (
                        <div key={displaySetting.id} onContextMenu={handleOnDisplaySettingContextMenu} data-display-setting-id={displaySetting.id} >
                          <hr/>
                          <div key={displaySetting.id} className="break-all pb-2 pl-1 whitespace-pre-wrap hover:bg-gray-800" style={{minHeight: "10px"}}>
                            {displaySetting.name}
                          </div>
                        </div>
                      ))}
                    </InfiniteScroll>
                }
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 編集モーダル */}
      {updateTargetDisplaySetting &&
        <DisplaySettingUpdateModal
          isOpen={isOpenUpdateModal}
          onClose={onCloseUpdateModal}
          displaySetting={updateTargetDisplaySetting}
        />
      }

    </>
  )
}
