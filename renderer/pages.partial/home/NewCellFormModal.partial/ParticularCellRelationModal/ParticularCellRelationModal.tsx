import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react"
import yup from '../../../../modules/yup';
import { Cell } from "../../../../models/ColumnSpaces";
import React from 'react';
import { Column, ColumnSpace } from '../../../../models/ColumnSpaces';
import { CellDataType, cellDataTypeIcons } from '../../../../resources/CellDataType';
import { CellInfo } from "./CellInfo";
import { RelationTargetForm } from "./RelationTargetForm";

type Props = {
  isOpen: boolean,
  onClose: any, //TODO 何の型
  onSubmitRelationForm: any, //TODO
  columnSpace: ColumnSpace,
  column: Column,
  cell: Cell,
}

//TODO カラムとかセルとかの文字の左にそれっぽいアイコンつけたい
export const ParticularCellRelationModal = (props: Props) => {

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size="6xl" closeOnEsc={false} closeOnOverlayClick={false} >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>セルのリレーション設定</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-row">

            {/* 対象セル */}
            <div className="w-1/2 pr-3">
              <div className="font-bold">対象セル</div>
              <div className="p-2">
                <div className="">
                  <div>カラム</div>
                  <div className="font-mono ml-4">
                    {cellDataTypeIcons(props.column.type, "w-4 h-4 inline-block mr-2")}{props.column.name}
                  </div>
                </div>
                <div className="mt-2">
                  <div>セル</div>
                  <div>
                    <CellInfo cell={props.cell}/>
                  </div>
                </div>
              </div>
            </div>

            <div style={{width: "2px"}} className="bg-gray-600"></div>

            {/* リレーション対象 */}
            <div className="w-1/2 pl-4">
              <RelationTargetForm
                {...props}
              />
            </div>

          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
