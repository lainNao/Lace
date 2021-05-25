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

export type TextCellBaseInfo = {
  columnSpaceId: string,
  columnId: string,
  cellId: string,
  type: CellDataType,
  data: {
    text: string
  },
}

type Props = {
  isOpen: boolean,
  onClose: any, //TODO 何の型
  cellData: TextCellBaseInfo,
}

export const TextCellUpdateModal = (props: Props) => {

  const setColumnSpace = useSetRecoilState(columnSpacesState);
  const toast = useToast()

  return (

    <Modal isOpen={props.isOpen} onClose={props.onClose} size="3xl" closeOnEsc={false} closeOnOverlayClick={false} >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>編集</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>
            <Formik
              initialValues={{
                text: props.cellData ? props.cellData.data?.text : "",
              }}
              onSubmit={async (value) => {
                const successMessage = (value.text.length > 15)
                  ? value.text.substring(0, 15)+"..."
                  : value.text;

                try{
                  const newColumnSpaces = await updateCellUsecase(props.cellData.columnSpaceId, props.cellData.columnId, new Cell({
                    id: props.cellData.cellId,
                    data: CellDataFactory.create(props.cellData.type, value),
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
                  text: yup
                    .string()
                    .required("必須です")
                    .filled("必須です")
                })
              }
            >{(formState) => (
              <Form className="">
                <div className="mb-2">before</div>
                <div className="mb-5 ml-4 break-all whitespace-pre-wrap">
                  {props.cellData ? props.cellData.data.text : ""}
                </div>

                <div className="mb-2">
                  <label htmlFor="text">after</label>
                </div>
                <Field name="text" >
                  {({ field, form }) => <Textarea {...field} spellCheck={false} rows={10} /> }
                </Field>
                {/* <ErrorMessage name="text" component="div" className="field-error font-black text-red-700 text-sm"/> */}

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