import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Select,
  IconButton,
  Button,
} from "@chakra-ui/react"
import {  DisplaySettings } from '../../models/DisplaySettings';
import { AddIcon } from '@chakra-ui/icons';
import { useRecoilValue } from 'recoil';
import selectedColumnSpaceIdState from '../../recoils/atoms/selectedColumnSpaceIdState';
import { useWindowHeight } from '@react-hook/window-size';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DisplaySettingAddForm } from './DisplaySettingModalpartial';

type Props = {
  isOpen: boolean,
  onClose: any, //TODO 何の型
  displaySettings: DisplaySettings,
}

export const DisplaySettingModal: React.FC<Props> = props => {
  const currentSelectedColumnSpaceId = useRecoilValue(selectedColumnSpaceIdState);
  const windowHeight = useWindowHeight()

  const handleOnDisplaySettingContextMenu = () => {
    console.log(111)
    //TODO 右クリメニュー（編集、削除）
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="6xl" closeOnEsc={false} closeOnOverlayClick={false} >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>表示設定</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-row pb-3">

            {/* 表示設定新規追加フォーム */}
            <div className="w-1/2 pl-4 pb-5">
              <DisplaySettingAddForm
                displaySettings={props.displaySettings}
              />
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
                        <div key={displaySetting.id} className="break-all pb-2 pl-1 whitespace-pre-wrap" style={{minHeight: "10px"}}>
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
  )
}
