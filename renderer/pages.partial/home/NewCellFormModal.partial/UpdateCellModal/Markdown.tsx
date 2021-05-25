import { Button, Textarea, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Input } from "@chakra-ui/react"
import React from 'react';
import { ErrorMessage, Field, FieldArray, Form, Formik, useFormik } from 'formik';
import yup from '../../../../modules/yup';
import { useSetRecoilState } from "recoil";
import { updateCellUsecase } from "../../../../usecases/updateCellUsecase";
import columnSpacesState from "../../../../recoils/atoms/columnSpacesState";
import { CellDataFactory } from "../../../../factories/CellDataFactory";
import { CellDataType } from "../../../../resources/CellDataType";
import { Cell } from "../../../../models/ColumnSpaces";

export type MarkdownCellBaseInfo = {
  columnSpaceId: string,
  columnId: string,
  cellId: string,
  type: CellDataType,
  data: {
    title: string,
    text: string
  },
}

type Props = {
  isOpen: boolean,
  onClose: any, //TODO 何の型
  cellData: MarkdownCellBaseInfo,
}

//TODO 下半分をプレビューに使いたい
export const MarkdownCellUpdateModal = (props: Props) => {

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
                title: props.cellData ? props.cellData.data?.title : "",
                text: props.cellData ? props.cellData.data?.text : "",
              }}
              onSubmit={async (value) => {
                const successMessage = (value.text.length > 15) ? value.text.substring(0, 15) + "..." : value.text;
                try{
                  const newColumnSpaces = await updateCellUsecase(props.cellData.columnSpaceId, props.cellData.columnId, new Cell({
                    id: props.cellData.cellId,
                    data: CellDataFactory.create(props.cellData.type, value),
                    type: props.cellData.type,
                  }));
                  setColumnSpace(newColumnSpaces);
                  toast({ title: `"${successMessage}"に更新しました`, status: "success", position: "bottom-right", isClosable: true, duration: 1500,})
                  props.onClose();
                } catch (e) {
                  console.log(e.stack);
                  toast({ title: e.message, status: "error", position: "bottom-right", isClosable: true, duration: 10000,})
                }
              }}
              validationSchema={
                yup.object().shape({
                  title: yup
                    .string()
                    .required("タイトルは必須です")
                    .filled("タイトルは必須です")
                  ,text: yup
                    .string()
                    .required("本文は必須です")
                    .filled("本文は必須です")
                })
              }
            >{(formState) => {
              return (
                <Form>
                  <div>
                    <label htmlFor="title">タイトル</label>
                    <Field name="title">
                      {({ field, form }) => <Input {...field}  spellCheck={false}/> }
                    </Field>
                    {/* <ErrorMessage name="title" component="div" className="field-error font-black text-red-700 text-sm" /> */}

                    <label htmlFor="text">本文（マークダウン）</label>
                    <Field name="text" >
                      {({ field, form, }) => <Textarea {...field}  spellCheck={false} rows={15} /> }
                    </Field>
                    {/* <ErrorMessage name="text" component="div" className="field-error font-black text-red-700 text-sm"/> */}
                  </div>

                  <div className="float-right mt-3 mb-2">
                    <Button type="submit" colorScheme="blue" mr={3} isDisabled={!formState.isValid || formState.isSubmitting}>完了</Button>
                    <Button variant="ghost" onClick={props.onClose}>キャンセル</Button>
                  </div>
                </Form>
                )
              }}
            </Formik>

          </div>
        </ModalBody>
      </ModalContent>
    </Modal>

  )
}