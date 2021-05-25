import React, { useState } from 'react';
import { ErrorMessage, Field, FieldArray, Form, Formik, useFormik } from 'formik';
import yup from '../../../modules/yup';
import { Input } from "@chakra-ui/react"
import { Button, Circle, IconButton, Textarea, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react"
import { NewCellFormModalBodyProps } from "../ColumnSpaceExplorer";
import { AddIcon, HamburgerIcon, ExternalLinkIcon, RepeatIcon, EditIcon } from "@chakra-ui/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import specificColumnState from "../../../recoils/selectors/specificColumnState";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { MarkdownCellData, TextCellData } from "../../../models/ColumnSpaces/CellData.implemented";
import { useWindowHeight } from '@react-hook/window-size'
import { useRef } from "react";
import { showCellContextMenu } from "../../../context-menus/showCellContextMenu";
import { remote } from "electron";
import { removeCellUsecase } from "../../../usecases/removeCellUsecase";
import columnSpacesState from "../../../recoils/atoms/columnSpacesState";
import relatedCellsState from "../../../recoils/atoms/relatedCellsState";
import { MarkdownCellBaseInfo, MarkdownCellUpdateModal } from "./UpdateCellModal/Markdown"
import { CellDataType } from "../../../resources/CellDataType";

export const NewCellFormModalBodyMarkdown: React.FC<NewCellFormModalBodyProps> = (props) => {

  //TODO 左サイドの下部半分をプレビューに使いたい

  const selectedColumn = useRecoilValue(specificColumnState(props.columnData.id));
  const windowHeight = useWindowHeight()
  const rightClickedCellRef = useRef(null);
  const toast = useToast();
  const [updateTargetCellData, setUpdateTargetCellData] = useState<MarkdownCellBaseInfo>(null);
  const { isOpen: isOpenUpdateModal, onOpen: openUpdateModal, onClose: onCloseUpdateModal } = useDisclosure();

  const handleOnCellContextMenu = useRecoilCallback(({set}) => async(event: React.MouseEvent<HTMLElement> ) => {
    const target = event.target as HTMLElement;
    const targetDataset = target.parentElement.dataset;

    rightClickedCellRef.current = target.parentElement;
    rightClickedCellRef.current.classList.add("bg-gray-800");

    showCellContextMenu(event, {
      handleClickUpdateCell: async () => {
        //TODO
        setUpdateTargetCellData({
          columnSpaceId: props.columnData.columnSpaceId,
          columnId: props.columnData.id,
          cellId: targetDataset.CellId,
          type: CellDataType.Markdown,
          data: {
            title: target.innerText,
            text: targetDataset.cellText,
          }
        });
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
              const [newColumnSpaces, newRelatedCells] = await removeCellUsecase(props.columnData.columnSpaceId, props.columnData.id, targetDataset.cellId);
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


  return (
    <>
      <div className="flex flex-row">
        <Formik
          initialValues={{
            title: '',
            text: '',
          }}
          onSubmit={async (value) => {
            const successMessage = (value.title.length > 15)
              ? value.title.substring(0, 15)+"..."
              : value.title;

            props.onClickCreateNewCell(props.columnData, [value], successMessage+"を追加しました");
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
                <div className="mb-3">新規マークダウン</div>
                <label htmlFor="title">タイトル</label>
                <Field name="title">
                  {({ field, form, ...props }) => <Input {...field} {...props} spellCheck={false}/> }
                </Field>
                {/* <ErrorMessage name="title" component="div" className="field-error font-black text-red-700 text-sm" /> */}

                <label htmlFor="text">本文（マークダウン）</label>
                <Field name="text" >
                  {({ field, form, ...props }) => <Textarea {...field} {...props} spellCheck={false} rows={15} /> }
                </Field>
                {/* <ErrorMessage name="text" component="div" className="field-error font-black text-red-700 text-sm"/> */}
              </div>

              <div className="float-right mt-3 mb-2">
                <Button type="submit" colorScheme="blue" mr={3} isDisabled={!formState.dirty || !formState.isValid || formState.isSubmitting}><AddIcon className="mr-2"/>追加</Button>
              </div>
            </Form>
          )}}
        </Formik>

        {/* 一覧 */}
        <div className="w-1/2 pb-3 pr-2 pl-10">
          <div className="mb-2">セル一覧（右クリックで編集/削除）</div>
          {selectedColumn.cells.children.length === 0
            ? <div>0件</div>
            : <InfiniteScroll
                dataLength={selectedColumn.cells.children.length}
                loader={<h4>Loading...</h4>}
                next={null}
                hasMore={false}
                height={windowHeight-260}
              >
                {selectedColumn.cells.mapChildren((cell, index) => (
                  <div key={cell.id} onContextMenu={handleOnCellContextMenu} data-cell-id={cell.id} data-cell-text={(cell.data as MarkdownCellData).text}>
                    <hr/>
                    <div key={cell.id} className="pb-2 pl-1" style={{minHeight: "10px"}}>
                      {(cell.data as MarkdownCellData).title}
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
          }
        </div>

      </div>


      {/* 編集モーダル */}
      <MarkdownCellUpdateModal
        isOpen={isOpenUpdateModal}
        onClose={onCloseUpdateModal}
        cellData={updateTargetCellData}
      />

    </>
  )
}

