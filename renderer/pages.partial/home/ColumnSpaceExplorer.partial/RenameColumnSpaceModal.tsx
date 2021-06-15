import React from 'react';
import { Button } from "@chakra-ui/react"
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Input } from "@chakra-ui/react"
import { ColumnSpace } from '../../../models/ColumnSpaces';
import { Field, Form, Formik } from 'formik';
import yup from '../../../modules/yup';

type Props = {
  columnSpace: ColumnSpace,
  isOpen: boolean,
  onClose: () => void,
  onSubmit: (columnSpaceId: string, newColumnSpaceName: string) => void,
}

export const RenameColumnSpaceModal = (props: Props) => {

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>カラムスペースのリネーム</ModalHeader>
        <ModalCloseButton style={{outline: "none"}} />
        <ModalBody>
          <Formik
            initialValues={{
              title: props.columnSpace.name,
            }}
            onSubmit={async (value) => {
              props.onSubmit(props.columnSpace.id, value.title);
            }}
            validationSchema={
              yup.object().shape({
                title: yup.string().required("必須です").filled("必須です")
              })
            }
          >{(formState) => {
            return (
              <Form>

                {/* 元の名前 */}
                <div className="mb-2">
                  <label htmlFor="text">before</label>
                </div>
                <div className="mb-5 ml-4">
                  {props.columnSpace.name}
                </div>

                {/* リネーム後 */}
                <div className="mb-2">
                  <label htmlFor="text">after</label>
                </div>
                <Field name="title" >
                  {({ field, form, ...props }) => <Input {...field} {...props} spellCheck={false} /> }
                </Field>

                {/* ボタン */}
                <div className="float-right mt-5 mb-2">
                  <Button type="submit" colorScheme="blue" mr={3} isDisabled={!formState.dirty || !formState.isValid || formState.isSubmitting}>変更</Button>
                  <Button variant="ghost" onClick={props.onClose}>キャンセル</Button>
                </div>
              </Form>

            )}}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>

  )
}