import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure } from "@chakra-ui/react"
import React, { useState } from 'react';
import { useFormik } from 'formik';
import yup from '../../../modules/yup';
import useSetupRelatedCells from "../../../hooks/useSetupRelatedCells";
import { NewCellFormModalBodyProps } from "../ColumnSpaceExplorer";


export interface NewTextCellFormFormData {
  text: string,
}

// TODO ここ、同じカラムスペースのカラム達をデータで持ってきて、関連セルを選択させるようなUIにすることが必要　そのUIどういう見た目にしてどういう実装ができるのか問題がある　そのデータはオブジェクトの配列でユースケースに送るんだろうけど　結構重労働なところだ…
// TODO そのUIたぶんマルチモーダルがいい（別ウィンドウは表示位置とかで結局UX悪そう）　マルチモーダルを頑張って…　でその出す新しいモーダルでは、同一カラムスペースにあるカラムを選択するセレクトボックスが一個あって、それを選択するとセル一覧が並ぶ感じだと思う　無限スクロール対策したほうがいいと思う
export const NewCellFormModalBodyText: React.FC<NewCellFormModalBodyProps> = (props) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [relatedCells, setRelatedCells] = useSetupRelatedCells();
  const [modifiedRelatedCells, setModifiedRelatedCells] = useState(false);

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
      props.onClickCreateNewCell(
        props.columnData,
        formData,
        (modifiedRelatedCells) ? relatedCells : null,
      );
    },
  });

  //TODO 関連セルモーダルで、任意でrelatedCellsを編集する
  //TODO 毎回relatedCellsを書き込むのがつらかったら、更新したときのみ書き込むフラグも作るかどうか考える　または単にこのフォーム内で状態管理して、いじってないならnull送るとか

  //TODO できればここでもソートカラムなどがほしい。その方が選びやすいから。後で。

  //TODO 仮想スクロール対応はまた後でパフォーマンス上問題が出た時など　または10000件登録してみてどうなるか確かめるなどする

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

      <Button onClick={onOpen}>他カラムセルとの関連付け</Button>

      <div className="float-right mt-3 mb-2">
        <Button type="submit" isDisabled={!(formik.isValid && formik.dirty)} colorScheme="blue" mr={3} >完了</Button>
        <Button variant="ghost" onClick={props.handleClickNewCellFormClose}>キャンセル</Button>
      </div>
      {/* TODO たぶん関連づけの操作もこのモーダル上でできるようにしたほうがいいと思う */}


      {/* TODO 以下はたぶん、各モーダルで共通になる */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="outside" isCentered>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>他カラムセルとの関連付け</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              以下を表示
              ・今のカラムスペースid
              ・それに属するカラムから今のカラムidを除いた配列
              ・選択中のカラムidのセルのデータ一覧
              その前にまずセル単体で登録できるようにしておいて。そうしないと表示形式が決まらないから。ここも大変かもだし。
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                確定
              </Button>
              <Button variant="ghost" onClick={onClose}>キャンセル</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>

    </form>
  )
}

