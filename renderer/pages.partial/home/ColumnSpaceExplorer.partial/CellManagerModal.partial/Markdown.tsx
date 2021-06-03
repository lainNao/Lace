import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import yup from '../../../../modules/yup';
import { Input } from "@chakra-ui/react"
import { Button, Textarea, useToast, useDisclosure } from "@chakra-ui/react"
import { CellManagerModalBodyProps } from "../../ColumnSpaceExplorer";
import { AddIcon } from "@chakra-ui/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { MarkdownCellData } from "../../../../models/ColumnSpaces/CellData.implemented";
import { useWindowHeight } from '@react-hook/window-size'
import { useRef } from "react";
import { showCellContextMenu } from "../../../../context-menus/showCellContextMenu";
import { remote } from "electron";
import { removeCellUsecase } from "../../../../usecases/removeCellUsecase";
import columnSpacesState from "../../../../recoils/atoms/columnSpacesState";
import relatedCellsState from "../../../../recoils/atoms/relatedCellsState";
import { MarkdownCellBaseInfo, MarkdownCellUpdateModal } from "./UpdateCellModal/Markdown"
import { CellDataType } from "../../../../resources/CellDataType";
import { ParticularCellRelationModal } from "./ParticularCellRelationModal";
import { Cell } from '../../../../models/ColumnSpaces';
import specificColumnSpaceState from '../../../../recoils/selectors/specificColumnSpaceState';

export const CellManagerModalBodyMarkdown: React.FC<CellManagerModalBodyProps> = (props) => {

  //TODO 左サイドの下部半分をプレビューに使いたい

  const currentColumnSpace = useRecoilValue(specificColumnSpaceState(props.columnSpaceId));
  const currentColumn = currentColumnSpace.findDescendantColumn(props.columnId);

  const windowHeight = useWindowHeight()
  const rightClickedCellRef = useRef(null);
  const toast = useToast();
  const [updateTargetCellData, setUpdateTargetCellData] = useState<MarkdownCellBaseInfo>(null);
  const [relationTargetCell, setRelationTargetCell] = useState<Cell>(null);
  const { isOpen: isOpenUpdateModal, onOpen: openUpdateModal, onClose: onCloseUpdateModal } = useDisclosure();
  const { isOpen: isOpenParticularCellRelationModal, onOpen: openParticularCellRelationModal, onClose: onCloseParticularCellRelationModal } = useDisclosure();

  const handleOnCellContextMenu = useRecoilCallback(({set}) => async(event: React.MouseEvent<HTMLElement> ) => {
    const target = event.target as HTMLElement;
    const targetDataset = target.parentElement.dataset;

    rightClickedCellRef.current = target.parentElement;
    rightClickedCellRef.current.classList.add("bg-gray-800");

    showCellContextMenu(event, {
      handleClickUpdateCell: async () => {
        setUpdateTargetCellData({
          columnSpaceId: currentColumnSpace.id,
          columnId: currentColumn.id,
          cellId: targetDataset.cellId,
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
          type: 'question',
          buttons: ["いいえ", 'はい'],
          message: '削除',
          detail: `以下を削除しますか？\n\n${target.innerText}`,
          noLink: true,
        }).then(async (res) => {
          if (res.response === 1) { //「はい」を選択した時
            const croppedValue = (target.innerText.length > 15) ? target.innerText.substring(0, 15)+"..." : target.innerText;
            try {
              // セルの削除
              const [newColumnSpaces, newRelatedCells] = await removeCellUsecase(currentColumnSpace.id, currentColumn.id, targetDataset.cellId);
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
        const cell = currentColumn.findCell(targetDataset.cellId);
        setRelationTargetCell(cell);
        openParticularCellRelationModal();
      },
      handleMenuWillClose: async () => {
        rightClickedCellRef.current.classList.remove("bg-gray-800");
      }
    });

  }, [currentColumnSpace, currentColumn])

  return (
    <>
      <div className="flex flex-row">
        {/* 新規追加フォーム */}
        <Formik
          initialValues={{
            title: '',
            text: '',
          }}
          onSubmit={async (value) => {
            const successMessage = (value.title.length > 15)
              ? value.title.substring(0, 15)+"..."
              : value.title;

            props.onClickCreateNewCell({
              columnSpaceId: currentColumnSpace.id,
              id: currentColumn.id,
              columnType: currentColumn.type,
            }, [value], successMessage+"を追加しました");
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
          {currentColumn.cells.children.length === 0
            ? <div  className="outline-none" style={{height: windowHeight-260 +"px"}}>0件</div>
            : <InfiniteScroll
                dataLength={currentColumn.cells.children.length}
                loader={<h4>Loading...</h4>}
                next={null}
                hasMore={false}
                height={windowHeight-260}
              >
                {currentColumn.cells.mapChildren((cell, index) => (
                  <div key={cell.id} onContextMenu={handleOnCellContextMenu} data-cell-id={cell.id} data-cell-text={(cell.data as MarkdownCellData).text}>
                    <hr/>
                    <div key={cell.id} className="break-all hover:bg-gray-800 pb-2 pl-1 whitespace-pre-wrap" style={{minHeight: "10px"}}>
                      {(cell.data as MarkdownCellData).title}
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
          }
        </div>

      </div>

      {/* 編集モーダル */}
      {updateTargetCellData &&
        <MarkdownCellUpdateModal
          isOpen={isOpenUpdateModal}
          onClose={onCloseUpdateModal}
          cellData={updateTargetCellData}
        />
      }

      {/* セルリレーション管理モーダル */}
      {relationTargetCell &&
        <ParticularCellRelationModal
          isOpen={isOpenParticularCellRelationModal}
          onClose={onCloseParticularCellRelationModal}
          onSubmitRelationForm={props.onSubmitRelationForm}
          columnSpace={currentColumnSpace}
          column={currentColumn}
          cell={relationTargetCell}
        />
      }

    </>
  )
}

