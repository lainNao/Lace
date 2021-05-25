import { Button, Circle, IconButton, Textarea, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react"
import React, { useCallback, useState } from 'react';
import { ErrorMessage, Field, FieldArray, Form, Formik, useFormik } from 'formik';
import yup from '../../../modules/yup';
import { NewCellFormModalBodyProps } from "../ColumnSpaceExplorer";
import { AddIcon, HamburgerIcon, ExternalLinkIcon, RepeatIcon, EditIcon } from "@chakra-ui/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import specificColumnState from "../../../recoils/selectors/specificColumnState";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { TextCellData } from "../../../models/ColumnSpaces/CellData.implemented";
import { useWindowHeight } from '@react-hook/window-size'
import { useRef } from "react";
import { showCellContextMenu } from "../../../context-menus/showCellContextMenu";
import { remote } from "electron";
import { removeCellUsecase } from "../../../usecases/removeCellUsecase";
import columnSpacesState from "../../../recoils/atoms/columnSpacesState";
import relatedCellsState from "../../../recoils/atoms/relatedCellsState";
import { TextCellBaseInfo, TextCellUpdateModal } from "./UpdateCellModal/Text"
import { CellDataType } from "../../../resources/CellDataType";

type NewTextCellData = {
  text: string,
}

export type NewTextCellsFormFormData = {
  data: NewTextCellData[],
};

export const NewCellFormModalBodyText: React.FC<NewCellFormModalBodyProps> = (props) => {

  const selectedColumn = useRecoilValue(specificColumnState(props.columnData.id));
  const newTextInputRef = useRef(null);
  const windowHeight = useWindowHeight()
  const rightClickedCellRef = useRef(null);
  const toast = useToast();
  const [updateTargetCellData, setUpdateTargetCellData] = useState<TextCellBaseInfo>(null);
  const { isOpen: isOpenUpdateModal, onOpen: openUpdateModal, onClose: onCloseUpdateModal } = useDisclosure();

  const handleOnCellContextMenu = useRecoilCallback(({set}) => async(event: React.MouseEvent<HTMLElement> ) => {
    const target = event.target as HTMLElement;
    const targetCellId = target.parentElement.dataset.cellId;

    rightClickedCellRef.current = target.parentElement;
    rightClickedCellRef.current.classList.add("bg-gray-800");

    showCellContextMenu(event, {
      handleClickUpdateCell: async () => {
        setUpdateTargetCellData({
          columnSpaceId: props.columnData.columnSpaceId,
          columnId: props.columnData.id,
          cellId: targetCellId,
          type: CellDataType.Text,
          data: {
            text: target.innerText,
          }
        })
        openUpdateModal();
      },
      handleClickDeleteCell: async () => {
        rightClickedCellRef.current.classList.add("bg-gray-800");
        remote.dialog.showMessageBox({
          type: 'info',
          buttons: ['はい', "いいえ"],
          title: '削除',
          message: '削除',
          detail: `以下を削除しますか？\n\n${target.innerText}`,
        }).then(async (res) => {
          if (res.response === 0) { //「はい」を選択した時
            const croppedValue = (target.innerText.length > 15) ? target.innerText.substring(0, 15)+"..." : target.innerText;
            try {
              // セルの削除
              const [newColumnSpaces, newRelatedCells] = await removeCellUsecase(props.columnData.columnSpaceId, props.columnData.id, targetCellId);
              set(columnSpacesState, newColumnSpaces);
              set(relatedCellsState, newRelatedCells);
              toast({ title: `"${croppedValue}"を削除しました`, status: "success", position: "bottom-right", isClosable: true, duration: 1500,})
            } catch (e) {
              toast({ title: e.message, status: "error", position: "bottom-right", isClosable: true, duration: 10000,})
              console.log(e.stack)
            }
            rightClickedCellRef.current.classList.remove("bg-gray-800");
          } else {
            rightClickedCellRef.current.classList.remove("bg-gray-800");
          }
        });
      },
      handleClickUpdateRelation: async() => {
        console.log("リレーションの更新");
        //TODO ここ実装する。既にあるリレーションのモーダルの下部分はそのまま使える気がする。上部分を固定値にする感じで。
      },
      handleMenuWillClose: async () => {
        rightClickedCellRef.current.classList.remove("bg-gray-800");
      }
    });

  }, [])

  //TODO サブミットが成功したらテキストエリアを空にしたい　失敗したらそのままにしたい

  return (
    <>
      <div className="flex flex-row">

        {/* 新規追加フォーム */}
        <Formik
          initialValues={{
            text: "",
          }}
          onSubmit={async (value) => {
            const successMessage = (value.text.length > 15)
              ? value.text.substring(0, 15)+"..."
              : value.text;

            props.onClickCreateNewCell(props.columnData, value, successMessage+"を追加しました");
            newTextInputRef.current.focus();
            // newTextInputRef.current.value = null;    //これ、失敗した時に消えたら残念なので行わない
          }}
          validationSchema={
            yup.object().shape({
              text: yup
                .string()
                .required("必須です")
                .filled("必須です")
            })
          }
        >{({ values }) => {
          return (
            <Form className="w-1/2">

              <div className="mb-2">
                <label htmlFor="text">新規テキスト</label>
              </div>
              <Field name="text" >
                {({ field, form, ...props }) => <Textarea {...field} {...props} spellCheck={false} rows={10} ref={newTextInputRef} /> }
              </Field>
              <ErrorMessage name="text" component="div" className="field-error font-black text-red-700 text-sm"/>

              <div className="float-right mt-3 mb-2">
                <Button type="submit" colorScheme="blue" mr={3} ><AddIcon className="mr-2"/>追加</Button>
              </div>
            </Form>

            )
          }}
        </Formik>

        {/* 一覧 */}
        <div className="w-1/2 pb-3 pr-2 pl-10">

          <div className="mb-2">セル一覧（右クリックで編集/削除）</div>
          <InfiniteScroll
            dataLength={selectedColumn.cells.children.length}
            loader={<h4>Loading...</h4>}
            next={null}
            hasMore={false}
            height={windowHeight-260}
          >
            {selectedColumn.cells.mapChildren((cell, index) => (
              <div key={cell.id} onContextMenu={handleOnCellContextMenu} data-cell-id={cell.id} >
                <hr/>
                <div key={cell.id} className="pb-2 pl-1" style={{minHeight: "10px"}}>
                  {(cell.data as TextCellData).text}
                </div>
              </div>
            ))}

          </InfiniteScroll>

        </div>
      </div>

      {/* 編集モーダル */}
      <TextCellUpdateModal
        isOpen={isOpenUpdateModal}
        onClose={onCloseUpdateModal}
        cellData={updateTargetCellData}
      />

    </>

  )
}

