import { Button, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Input } from "@chakra-ui/react"
import React from 'react';
import { Field, Form, Formik } from 'formik';
import yup from '../../../../../modules/yup';
import { useSetRecoilState } from "recoil";
import { updateCellUsecase } from "../../../../../usecases/updateCellUsecase";
import columnSpacesState from "../../../../../recoils/atoms/columnSpacesState";
import { CellDataFactory } from "../../../../../factories/CellDataFactory";
import { CellDataType } from "../../../../../resources/CellDataType";
import { Cell } from "../../../../../models/ColumnSpaces";

export type FileCellBaseInfo = {
  columnSpaceId: string,
  columnId: string,
  cellId: string,
  type: CellDataType,
  data: {
    path: string,
    alias: string,
  },
}

type Props = {
  isOpen: boolean,
  onClose: any, //TODO 何の型
  cellData: FileCellBaseInfo,
}

export const FileRenameModal = (props: Props) => {

  const setColumnSpace = useSetRecoilState(columnSpacesState);
  const toast = useToast()

  return (

    <Modal isOpen={props.isOpen} onClose={props.onClose} size="3xl" closeOnEsc={false} closeOnOverlayClick={false} >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>リネーム</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>
            <Formik
              initialValues={{
                alias: props.cellData ? props.cellData.data?.alias : "",
              }}
              onSubmit={async (value) => {
                const successMessage = (value.alias.length > 15)
                  ? value.alias.substring(0, 15)+"..."
                  : value.alias;

                try{
                  const newColumnSpaces = await updateCellUsecase(props.cellData.columnSpaceId, props.cellData.columnId, new Cell({
                    id: props.cellData.cellId,
                    data: CellDataFactory.create(props.cellData.type, {
                      path: props.cellData.data.path,
                      alias: value.alias,
                    }),
                    type: props.cellData.type,
                  }));
                  setColumnSpace(newColumnSpaces);
                  toast({
                    title: `"${successMessage}"に更新しました`,
                    status: "success",
                    position: "bottom-right",
                    isClosable: true,
                    duration: 1500,
                  })
                  props.onClose();
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
              }}
              validationSchema={
                yup.object().shape({
                  alias: yup
                    .string()
                    .required("必須です")
                    .filled("必須です")
                })
              }
            >{(formState) => (
              <Form className="">
                <div className="mb-2">before</div>
                <div className="mb-5 ml-4 break-all whitespace-pre-wrap">
                  {props.cellData ? props.cellData.data.alias : ""}
                </div>

                <div className="mb-2">
                  <label htmlFor="alias">after</label>
                </div>
                <Field name="alias" >
                  {({ field, form }) => <Input {...field} spellCheck={false} /> }
                </Field>

                <div className="float-right mt-3 mb-2">
                  <Button type="submit" colorScheme="blue" mr={3} isDisabled={!formState.isValid || formState.isSubmitting}>適用</Button>
                  <Button variant="ghost" onClick={props.onClose}>キャンセル</Button>
                </div>
              </Form>
            )}
            </Formik>

          </div>
        </ModalBody>
      </ModalContent>
    </Modal>

  )
}