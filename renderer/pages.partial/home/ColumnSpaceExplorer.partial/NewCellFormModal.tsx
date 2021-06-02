import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"

type Props = {
  isOpen: boolean,
  onClose: any, //TODO 何の型
  children: any, //TODO
  title: string,
}

//TODO なぜかこのモーダル上で右クリしたらemptyスペースを右クリしたのと同じコンテキストメニューが出てるから直す
export const NewCellFormModal: React.FC<Props> = props => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="6xl" closeOnEsc={false} closeOnOverlayClick={false} >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {props.children}
          {/* TODO 「+」ボタンとかで複製できるようにしたい。 */}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
