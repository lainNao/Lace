import React from 'react';
import { Button } from "@chakra-ui/react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Input,
} from "@chakra-ui/react"
import { ColumnDataType } from '../../resources/ColumnDataType';

type Props = {
  columnDataType: ColumnDataType,
  isOpen: boolean,
  onClose: any, //TODO 何の型
  formRef: any, //TODO 何の型
  onClickCreateNewCell: any, //TODO　同上
  handleClickNewCellFormClose: any, //TODO　同上
  children: any, //TODO
}

export const NewCellFormModal: React.FC<Props> = props => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>セルの新規作成</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form ref={props.formRef} onSubmit={(e) => e.preventDefault()} className="mb-3">
            {props.children}
            {/* ポリモーフィズムで「New～FormModal」を描画。「+」ボタンとかで複製できるようにしたい。 */}
          </form>
        </ModalBody>

        <ModalFooter>
          {/* TODO isDisabledの条件はどう決める？ */}
          <Button onClick={props.onClickCreateNewCell} isDisabled={null} colorScheme="blue" mr={3} >作成</Button>
          <Button variant="ghost" onClick={props.handleClickNewCellFormClose}>キャンセル</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
