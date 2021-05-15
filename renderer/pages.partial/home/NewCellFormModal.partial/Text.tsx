import { Button, Textarea } from "@chakra-ui/react"
import React from 'react';
import { useFormik } from 'formik';
import yup from '../../../modules/yup';

type Props = {
  errors: string[],
  columnData: any,
  onClickCreateNewCell: any, //TODO
  handleClickNewCellFormClose: any, //TODO
}

export interface NewTextCellFormFormData {
  text: string,
  //TODO ここにもう一個関連セルを示すオブジェクトも追加するはず　{他カラムID:[セルID, セルId,...], ...}　的な
}

// TODO ここ、同じカラムスペースのカラム達をデータで持ってきて、関連セルを選択させるようなUIにすることが必要　そのUIどういう見た目にしてどういう実装ができるのか問題がある　そのデータはオブジェクトの配列でユースケースに送るんだろうけど　結構重労働なところだ…
// TODO そのUIたぶんマルチモーダルがいい（別ウィンドウは表示位置とかで結局UX悪そう）　マルチモーダルを頑張って…　でその出す新しいモーダルでは、同一カラムスペースにあるカラムを選択するセレクトボックスが一個あって、それを選択するとセル一覧が並ぶ感じだと思う　無限スクロール対策したほうがいいと思う
export const NewCellFormModalBodyText: React.FC<Props> = (props) => {

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
    onSubmit: (values: NewTextCellFormFormData) => {
      props.onClickCreateNewCell(props.columnData, values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Textarea name="text" spellCheck={false} isInvalid={Boolean(formik.errors.text)} rows={6} value={formik.values.text} onChange={formik.handleChange} autoFocus />
      <div className="font-black text-red-700 text-sm">{Boolean(formik.errors.text) ? formik.errors.text : "　"}</div>

      <div>TODO ここに他カラムのセルを関連づけるUIを作るという重い作業がある</div>

      {props.errors?.length > 0 &&
        <div className="">
          TODO ここきれいに表示するようにしといて　後これ以上モーダルが増えるなら、このエラーメッセージの状態もモーダルごとに分けて
          {props.errors.map((errorMessage, index) => {
            <div key={index}>{errorMessage}</div>
          })}
        </div>
      }
      <div className="float-right mt-3 mb-2">
        <Button type="submit" isDisabled={!(formik.isValid && formik.dirty)} colorScheme="blue" mr={3} >作成</Button>
        <Button variant="ghost" onClick={props.handleClickNewCellFormClose}>キャンセル</Button>
      </div>
      {/* TODO たぶん関連づけの操作もこのモーダル上でできるようにしたほうがいいと思う */}
    </form>
  )
}

