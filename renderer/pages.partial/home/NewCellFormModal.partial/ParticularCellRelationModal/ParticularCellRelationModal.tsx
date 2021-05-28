import { Button, Textarea, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react"
import React from 'react';
import { ErrorMessage, Field, FieldArray, Form, Formik, useFormik } from 'formik';
import yup from '../../../../modules/yup';
import { useSetRecoilState } from "recoil";
import { updateCellUsecase } from "../../../../usecases/updateCellUsecase";
import columnSpacesState from "../../../../recoils/atoms/columnSpacesState";
import { CellDataFactory } from "../../../../factories/CellDataFactory";
import { CellDataType } from "../../../../resources/CellDataType";
import { Cell } from "../../../../models/ColumnSpaces";


export type ParticularCellBaseInfo = {
  columnSpaceId: string,
  columnId: string,
  cellId: string,
  type: CellDataType,
  data: any, //TODO どうするかな
}

type Props = {
  isOpen: boolean,
  onClose: any, //TODO 何の型
  cellData: ParticularCellBaseInfo,
}

export const ParticularCellRelationModal = (props: Props) => {

  const toast = useToast()

  return (

    <Modal isOpen={props.isOpen} onClose={props.onClose} size="3xl" closeOnEsc={false} closeOnOverlayClick={false} >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>セルのリレーション設定</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>
            asdfasdf
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>

  )
}