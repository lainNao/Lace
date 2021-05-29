import { Button, Select } from "@chakra-ui/react"
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import yup from '../../../../modules/yup';
import { useRecoilState } from "recoil";
import React, { useCallback, useMemo, useState } from 'react';
import { Cell, Column, ColumnSpace } from '../../../../models/ColumnSpaces';
import { cellDataTypeSelectOptionText } from '../../../../resources/CellDataType';
import { CheckboxContainer, CheckboxControl } from "formik-chakra-ui";
import relatedCellsState from "../../../../recoils/atoms/relatedCellsState";
import { cloneDeep } from "lodash";
import { CellRelationFormData } from "../../CellRelationModal";
import { useEffect } from "react";
import { RelatedCells } from "../../../../models/RelatedCells";

const validationSchema = yup.object().shape({
  targetCell: yup.object().shape({
    columnId: yup.string().required("必須です"),
    cellId: yup.string().required("必須です"),
  }),
});

type Props = {
  isOpen: boolean,
  onClose: any, //TODO 何の型
  onSubmitRelationForm: any, //TODO
  columnSpace: ColumnSpace,
  column: Column,
  cell: Cell,
}

export const RelationTargetForm = (props: Props) => {

  const [rootRelatedCells, setRelatedCells] = useRecoilState(relatedCellsState);
  const [initialValues, setInitialValues] = useState<CellRelationFormData>({
    targetCell: {
      columnId: props.columnSpace.id ?? "",
      cellId: props.cell.id ?? "",
    },
    relatedCells: {},
  });
  const [toColumnId, setToClumnId] = useState(null);

  /// 関連先セルの選択肢を作成
  const currentToCellOptions = useMemo(() => {
    // {"カラムID": [セルid,...],}
    const options = {};
    props.columnSpace.columns?.children?.forEach(column => { //NOTE: 直接かなり深いところまで行ってるから暇ならどうにかする
      options[column.id] = column.mapCells(cell => {
        return { value: cell.id, label: cellDataTypeSelectOptionText(cell.type, cell.data) }  //TODO ここ、可能ならメディアのプレビュー程度も選択肢に一緒に見せたい。まあ後で
      })
    })
    return options;
  }, [props.columnSpace]);

  /// 関連先カラムの変更イベント
  const onChangeToColumnId = useCallback((event, setFieldValue) => {
    setToClumnId(event.target.value);
  }, [props.columnSpace]);

  // 関連先の選択状態によってフォームの値を変更する
  useEffect(() => {

    const targetRelatedCells = {};
    const relatedCellsTemp = cloneDeep<RelatedCells>(rootRelatedCells); // NOTE: propsはイミュータブルなので一時変数に置き換えているだけ

    // 使うキーが無い場合は事前作成（でないとエラー起きるため）
    if (!relatedCellsTemp.data[props.columnSpace.id]) {
      relatedCellsTemp.data[props.columnSpace.id] = {};
    }
    if (!relatedCellsTemp.data[props.columnSpace.id][props.columnSpace.id]) {
      relatedCellsTemp.data[props.columnSpace.id][props.columnSpace.id] = {};
    }

    // 関連セル情報（relatedCellsオブジェクト）を設定
    for (const column of props.columnSpace.columns.children) {
      const defaultCells = relatedCellsTemp.data[props.columnSpace.id][props.column.id][props.cell.id];
      targetRelatedCells[column.id] = (defaultCells && defaultCells[column.id]) ? {cellIds: defaultCells[column.id]} : {cellIds: []}; //NOTE: ここ汚くてごめん　cellIds消す方法わからなかったからつける
    }

    setInitialValues({
      targetCell: {
        columnId: props.column.id,
        cellId: props.cell.id,
      },
      relatedCells: targetRelatedCells,
    })

  }, [rootRelatedCells]);

  useEffect(() => {
    return () => {
      setToClumnId(null);
    }
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={async (values) => {
        props.onSubmitRelationForm(values, props.columnSpace.id);
      }}
      validationSchema={validationSchema}
    >{({ setFieldValue }) => {
      return (
        <Form>
          <div className="mb-4 font-bold">リレーション対象</div>
          <div className="flex flex-col ml-5">

            {/* カラム選択 */}
            <Select placeholder="カラムを選択" onChange={(e) => onChangeToColumnId(e, setFieldValue)}>
              {props.columnSpace?.columns
                .filterChildren(col => col.id !== props.column.id)
                .map(col => {
                  const column = col as Column;
                  return (
                    <option key={column.id} value={column.id}  className={`${column.id === props.columnSpace.id ? "hidden" : ""}`}>
                      {column.name}
                    </option>
                  )
                })
              }
            </Select>

            {/* 選択されたカラムのセル一覧 */}
            <FieldArray name="relatedCells">
              {() => (
                <div className={`${!props.cell.id ? "hidden" : ""}  `}>
                  {props.columnSpace.columns.mapChildren((col, columnIndex) => {
                      const column = col as Column;
                      // TODO パフォーマンスの問題でUXが微妙なのでいつか手を入れるかも。そもそも無限スクロールにしないと破綻すると思う
                      return (
                        <div key={column.id} className={`${(column.id === props.columnSpace.id) ? "hidden" : ""}`}>  {/* NOTE: 今選択されているカラムIDを持たないのは表示しないがフォーム上値は存在させるためhidden化 */}
                          <CheckboxContainer name={`relatedCells.${column.id}.cellIds`} className={`${(column.id !== toColumnId) ? "hidden" : ""}`}>
                            {currentToCellOptions[column.id].map((option, cellIndex) => (
                              <CheckboxControl key={option.value + columnIndex + cellIndex} name={`relatedCells.${column.id}.cellIds`} value={option.value} >
                                {option.label}
                              </CheckboxControl>
                            ))}
                          </CheckboxContainer>
                        </div>
                      )
                    })
                  }
                </div>
              )}
            </FieldArray>
          </div>

          {/* モーダルフッター */}
          <div className="float-right mt-3 mb-2">
            <Button type="submit" colorScheme="blue" mr={3} >適用</Button>
          </div>
        </Form>

        )
      }}
    </Formik>

  )
}