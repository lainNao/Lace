import { Button, Textarea } from "@chakra-ui/react"
import React, { useState } from 'react';
import { useFormik } from 'formik';
import yup from '../../../modules/yup';
import { NewCellFormModalBodyProps } from "../ColumnSpaceExplorer";

export interface NewTextCellFormFormData {
  text: string,
}

export const NewCellFormModalBodyText: React.FC<NewCellFormModalBodyProps> = (props) => {

  const formik = useFormik({
    initialValues: {
      text: '',
    },
    validationSchema: yup.object({
      text: yup
        .string()
        .required("必須です")
        .filled("必須です")
    }),
    onSubmit: (formData: NewTextCellFormFormData) => {
      props.onClickCreateNewCell(props.columnData, formData);
    },
  });

  //TODO 複数登録。＋ボタン表示したり。
  //TODO 仮想スクロール対応はまた後でパフォーマンス上問題が出た時など　または10000件登録してみてどうなるか確かめるなどする

  return (
    <form onSubmit={formik.handleSubmit}>
      <Textarea name="text" spellCheck={false} isInvalid={Boolean(formik.errors.text)} rows={6} value={formik.values.text} onChange={formik.handleChange} autoFocus />
      <div className="font-black text-red-700 text-sm">{Boolean(formik.errors.text) ? formik.errors.text : "　"}</div>
      <div className="float-right mt-3 mb-2">
        <Button type="submit" isDisabled={!(formik.isValid && formik.dirty)} colorScheme="blue" mr={3} >完了</Button>
        <Button variant="ghost" onClick={props.handleClickNewCellFormClose}>キャンセル</Button>
      </div>
    </form>
  )
}

