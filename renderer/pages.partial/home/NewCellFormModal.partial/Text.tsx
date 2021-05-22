import { Button, Circle, IconButton, Textarea } from "@chakra-ui/react"
import React, { useState } from 'react';
import { ErrorMessage, Field, FieldArray, Form, Formik, useFormik } from 'formik';
import yup from '../../../modules/yup';
import { NewCellFormModalBodyProps } from "../ColumnSpaceExplorer";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";

type NewTextCellData = {
  text: string,
}

export type NewTextCellsFormFormData = {
  data: NewTextCellData[],
};

export const NewCellFormModalBodyText: React.FC<NewCellFormModalBodyProps> = (props) => {

  //TODO マークダウンの場合はプレビューも用意しておきたい

  return (

    <Formik
      initialValues={{
        data: [{
          text: '',
        }],
      }}
      onSubmit={async (values) => {
        props.onClickCreateNewCell(props.columnData, values.data);
      }}
      validationSchema={
        yup.object().shape({
          data: yup.array().of(
            yup.object().shape({
              text: yup
                .string()
                .required("必須です")
                .filled("必須です")
            })
          )
        })
      }
    >{({ values }) => {
      return (
        <Form>
          <FieldArray name="data">
            {({ remove, push }) => (
              <div>
                {values.data.length > 0 && values.data.map((data, index) => (
                  <React.Fragment key={index}>
                    {index !== 0 &&
                      <>
                        <hr className="my-5"></hr>
                        <div className="text-right">
                          <Button size="xs" mr={3} onClick={() => remove(index)} ><CloseIcon/></Button>
                        </div>
                      </>
                    }

                    <label htmlFor={`data.${index}.text`}>テキスト</label>
                    <Field name={`data.${index}.text`} >
                      {({ field, form, ...props }) => <Textarea {...field} {...props} spellCheck={false} rows={10} /> }
                    </Field>
                    <ErrorMessage name={`data.${index}.text`} component="div" className="field-error font-black text-red-700 text-sm"/>

                  </React.Fragment>
                ))}

                <IconButton aria-label="add" icon={<AddIcon/>}  className="mt-2" onClick={() => push({ text: '' })}/>

              </div>
            )}
          </FieldArray>
          <div className="float-right mt-3 mb-2">
            {/* <Button type="submit" isDisabled={!(formik.isValid && formik.dirty)} colorScheme="blue" mr={3} >完了</Button> */}
            <Button type="submit" colorScheme="blue" mr={3} >完了</Button>
            <Button variant="ghost" onClick={props.handleClickNewCellFormClose}>キャンセル</Button>
          </div>
        </Form>

        )
      }}
    </Formik>
  )
}

