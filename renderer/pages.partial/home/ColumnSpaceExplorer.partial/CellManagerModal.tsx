import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react"
import { CellManagerModalBodyComponents } from './CellManagerModal.partial';
import { CellDataType } from '../../../resources/CellDataType';

export type CellManagerModalDataType = {
  columnSpaceId: string;
  columnId: string;
  columnType: CellDataType;
  columnName: string;
}

type Props = {
  isOpen: boolean,
  onClose: any, //TODO 何の型
  children: any, //TODO
  title: string,
  //以下ボディ用
  //TODO onなのかhandleなのか
  cellManagerModalData: any, //TODO 型
  onClickCreateNewCell: any //TODO 型
  handleClickNewCellFormClose: any //TODO 型
  onSubmitRelationForm: any //TODO 型
  handleNewCellFormCloseButtonClick: any,//TODO 型
  handleNewCellFormCreateButtonClick: any,//TODO 型
}

export const CellManagerModal: React.FC<Props> = props => {

  const CellManagerModalBody = CellManagerModalBodyComponents[props.cellManagerModalData.columnType];

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="6xl" closeOnEsc={false} closeOnOverlayClick={false} >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{props.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CellManagerModalBody
            onClickCreateNewCell={props.handleNewCellFormCreateButtonClick}
            handleClickNewCellFormClose={props.handleNewCellFormCloseButtonClick}
            columnSpaceId={props.cellManagerModalData.columnSpaceId}
            columnId={props.cellManagerModalData.columnId}
            onSubmitRelationForm={props.onSubmitRelationForm}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
