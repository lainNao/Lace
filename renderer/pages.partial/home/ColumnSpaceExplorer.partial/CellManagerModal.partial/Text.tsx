import { Button, Textarea, useToast, useDisclosure } from "@chakra-ui/react"
import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import yup from '../../../../modules/yup';
import { CellManagerModalBodyProps } from "../../ColumnSpaceExplorer";
import { AddIcon } from "@chakra-ui/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { TextCellData } from "../../../../models/ColumnSpaces/CellData.implemented";
import { useWindowHeight } from '@react-hook/window-size'
import { useRef } from "react";
import { showCellContextMenu } from "../../../../context-menus/showCellContextMenu";
import { remote } from "electron";
import { removeCellUsecase } from "../../../../usecases/removeCellUsecase";
import columnSpacesState from "../../../../recoils/atoms/columnSpacesState";
import relatedCellsState from "../../../../recoils/atoms/relatedCellsState";
import { TextCellBaseInfo, TextCellUpdateModal } from "./UpdateCellModal/Text"
import { CellDataType } from "../../../../resources/CellDataType";
import { ParticularCellRelationModal } from "./ParticularCellRelationModal";
import { Cell } from "../../../../models/ColumnSpaces";
import specificColumnSpaceState from "../../../../recoils/selectors/specificColumnSpaceState";
import { CellViewer } from '../../../../components/CellViewer';

//TODO ここのセルへのonmouse、hoverが二重になってて手前だけ効いて奥は効いてないみたいな見た目になる時あるから後で直すか、
export const CellManagerModalBodyText: React.FC<CellManagerModalBodyProps> = (props) => {

  const currentColumnSpace = useRecoilValue(specificColumnSpaceState(props.columnSpaceId));
  const currentColumn = currentColumnSpace.findDescendantColumn(props.columnId);

  const newTextInputRef = useRef(null);
  const windowHeight = useWindowHeight()
  const rightClickedCellRef = useRef(null);
  const toast = useToast();
  const [updateTargetCellData, setUpdateTargetCellData] = useState<TextCellBaseInfo>(null);
  const [relationTargetCell, setRelationTargetCell] = useState<Cell>(null);
  const { isOpen: isOpenUpdateModal, onOpen: openUpdateModal, onClose: onCloseUpdateModal } = useDisclosure();
  const { isOpen: isOpenParticularCellRelationModal, onOpen: openParticularCellRelationModal, onClose: onCloseParticularCellRelationModal } = useDisclosure();
  const [targetCell, setTargetCell] = useState(null);

  const handleOnCellContextMenu = useRecoilCallback(({set}) => async(event: React.MouseEvent<HTMLElement> ) => {
    const target = event.target as HTMLElement;

    rightClickedCellRef.current = target.parentElement;
    rightClickedCellRef.current.classList.add("bg-gray-800");

    showCellContextMenu(event, {
      // 編集
      handleClickUpdateCell: async () => {
        setUpdateTargetCellData({
          columnSpaceId: currentColumnSpace.id,
          columnId: currentColumn.id,
          cellId: targetCell.id,
          type: CellDataType.Text,
          data: {
            text: targetCell.data.text,
          }
        });
        openUpdateModal();
      },
      // リレーション管理
      handleClickUpdateRelation: async() => {
        const cell = currentColumn.findCell(targetCell.id);
        setRelationTargetCell(cell);
        openParticularCellRelationModal();
      },
      // 削除
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
              const [newColumnSpaces, newRelatedCells] = await removeCellUsecase(currentColumnSpace.id, currentColumn.id, targetCell.id);
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
      handleMenuWillClose: async () => {
        rightClickedCellRef.current.classList.remove("bg-gray-800");
      }
    });

  }, [currentColumnSpace, currentColumn, targetCell])

  const handleOnMouseCell = (event, cell: Cell) => {
    console.debug("セルにonmouse");
    setTargetCell(cell);
  }


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

            props.onClickCreateNewCell({
              columnSpaceId: currentColumnSpace.id,
              id: currentColumn.id,
              columnType: currentColumn.type,
            }, [value], successMessage+"を追加しました");
            newTextInputRef.current.focus();
          }}
          validationSchema={
            yup.object().shape({
              text: yup
                .string()
                .required("必須です")
                .filled("必須です")
            })
          }
        >{(formState) => {
          return (
            <Form className="w-1/2">

              <div className="mb-2">
                <label htmlFor="text">新規テキスト</label>
              </div>
              <Field name="text" >
                {({ field, form, ...props }) => <Textarea {...field} {...props} spellCheck={false} rows={10} ref={newTextInputRef} /> }
              </Field>
              {/* <ErrorMessage name="text" component="div" className="field-error font-black text-red-700 text-sm"/> */}

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
            ? <div className="outline-none" style={{height: windowHeight-260 +"px"}}>0件</div>
            : <InfiniteScroll
                dataLength={currentColumn.cells.children.length}
                loader={<h4>Loading...</h4>}
                next={null}
                hasMore={false}
                height={windowHeight-260}
              >
                {currentColumn.cells.mapChildren((cell, index) => (
                  <div key={cell.id} onContextMenu={handleOnCellContextMenu} data-cell-id={cell.id} >
                    <hr/>
                    <div key={cell.id} className="break-all hover:bg-gray-800 pb-2 pl-1 whitespace-pre-wrap" style={{minHeight: "10px"}}>
                      <CellViewer
                        key={cell.id}
                        cell={cell}
                        withLiPrefix={false}
                        onMouseMainCell={(e) => handleOnMouseCell(e, cell)}
                      />
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
          }
        </div>
      </div>

      {/* 編集モーダル */}
      {updateTargetCellData &&
        <TextCellUpdateModal
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
          columnSpace={currentColumnSpace}
          column={currentColumn}
          onSubmitRelationForm={props.onSubmitRelationForm}
          cell={relationTargetCell}
        />
      }

    </>

  )
}

