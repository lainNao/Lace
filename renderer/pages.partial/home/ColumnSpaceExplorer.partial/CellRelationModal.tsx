import React, { useCallback, useMemo, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, Select } from "@chakra-ui/react"
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import yup from '../../../modules/yup';
import { CustomSelect } from '../../../components/CustomSelect';
import { Column } from '../../../models/ColumnSpaces';
import { cellDataTypeSelectOptionText } from '../../../resources/CellDataType';
import { CheckboxContainer, CheckboxControl } from "formik-chakra-ui";
import { RelatedCells } from '../../../models/RelatedCells';
import { cloneDeep } from "lodash"
import { useRecoilValue } from 'recoil';
import selectedColumnSpaceIdState from '../../../recoils/atoms/selectedColumnSpaceIdState';
import specificColumnSpaceState from "../../../recoils/selectors/specificColumnSpaceState";
import { CellInfo } from './CellManagerModal.partial/ParticularCellRelationModal/CellInfo';

export type CellRelationFormData = {
  targetCell: {
    columnId: string,
    cellId: string,
  },
  relatedCells: {
    [columnId: string]: {
      cellIds: string[],  //NOTE: ここどうしても「cellIds」というキーを作らないと今の実力ではできなかった。最初から配列をcolumnIdの値に入れてよかったけど
    }
  },
};

type Props = {
  isOpen: boolean,
  onClose: any, //TODO 何の型
  onSubmit: any, //TODO 何の型
  relatedCells: RelatedCells,
}

const validationSchema = yup.object({
  targetCell: yup.object({
    columnId: yup.string().required("必須です"),
    cellId: yup.string().required("必須です"),
  }),
});

export const CellRerationModal: React.FC<Props> = props => {
  const currentSelectedColumnSpaceId = useRecoilValue(selectedColumnSpaceIdState);
  const currentSelectedColumnSpace = useRecoilValue(specificColumnSpaceState(currentSelectedColumnSpaceId));
  const [currentColumnFromCellOptions, setCurrentColumnFromCellOptions] = useState([]);
  const [fromColumnValue, setFromColumnValue] = useState(null);
  const [fromCellValue, setFromCellValue] = useState(null);
  const [toColumnValue, setToColumnValue] = useState(null);
  const [currentCell, setCurrentCell] = useState(null); //NOTE: fromCellValueと役割かぶってるわ　直すとしてもモーダル全体直したいところ…

  /// 関連元カラムの選択肢を作成
  const currentFromColumnOptions = useMemo(() => {
    if (!(props.relatedCells && currentSelectedColumnSpace)) return [];

    const fromColumnOptions = currentSelectedColumnSpace.columns?.mapChildren(column => {
      return { value: column.id, label: column.name }
    }) as {value:any, label:string}[];

    if (!fromColumnOptions) return [];

    return fromColumnOptions;

  }, [props.relatedCells, currentSelectedColumnSpace]);

  /// 関連先セルの選択肢を作成
  const currentToCellOptions = useMemo(() => {
    // {"カラムID": [セルid,...],}
    const options = {};
    currentSelectedColumnSpace.columns?.children?.forEach(column => { //NOTE: 直接かなり深いところまで行ってるから暇ならどうにかする
      options[column.id] = column.mapCells(cell => {
        return { value: cell.id, label: cellDataTypeSelectOptionText(cell.type, cell.data) }  //TODO ここ、可能ならメディアのプレビュー程度も選択肢に一緒に見せたい。まあ後で
      })
    })
    return options;
  }, [currentSelectedColumnSpace]);

  /// 関連元カラムの変更イベント
  const onChangeFromColumnId = useCallback((columnId, setFieldValue) => {
    setFromColumnValue(columnId);

    // セルの選択肢を初期化
    setFromCellValue(null); //NOTE: CustomSelectのonChangeを発火させるために無理やりやるしかなかった。暫定。後で直すなら、そもそも学習し直してからにしてくれ。半端にやるとこうなる
    setFieldValue("targetCell.cellId", "");
    setCurrentCell(null);

    // セルの選択肢を変える
    const fromCellOptions = currentSelectedColumnSpace.columns?.findChildColumn(columnId)?.mapCells(cell => {
      return { value: cell.id, label: cellDataTypeSelectOptionText(cell.type, cell.data) }    //TODO ここ、可能ならメディアのプレビュー程度も選択肢に一緒に見せたい。まあ後で
    }) as {value:any, label:string}[];
    if (!fromCellOptions) {
      setCurrentColumnFromCellOptions([]);
      return;
    }
    setCurrentColumnFromCellOptions(fromCellOptions);
  }, [currentSelectedColumnSpace]);

  /// 関連元セルの変更イベント
  const onChangeFromCellId = useCallback((cellId, setFieldValue) => {
    setFieldValue("targetCell.cellId", cellId);
    setFromCellValue(cellId);

    const cell = currentSelectedColumnSpace.findBellowCell(cellId, fromColumnValue);
    setCurrentCell(cell);
  }, [currentSelectedColumnSpace, fromColumnValue]);

  /// 関連先カラムの変更イベント
  const onChangeToColumnId = useCallback((event, setFieldValue) => {
    setToColumnValue(event.target.value);

  }, [currentSelectedColumnSpace]);

  // 関連先の選択状態によってフォームの値を変更する
  const initialValues = useMemo(() => {
    if (!(props.relatedCells && currentSelectedColumnSpace && fromColumnValue && fromCellValue)) {
      return {
        targetCell: {
          columnId: fromColumnValue ?? "",
          cellId: fromCellValue ?? "",
        },
        relatedCells: {},
      };
    }

    const relatedCells = {};
    const relatedCellsTemp = cloneDeep(props.relatedCells); // NOTE: propsはイミュータブルなので一時変数に置き換えているだけ

    // 使うキーが無い場合は事前作成（でないとエラー起きるため）
    if (!relatedCellsTemp.data[currentSelectedColumnSpace.id]) {
      relatedCellsTemp.data[currentSelectedColumnSpace.id] = {};
    }
    if (!relatedCellsTemp.data[currentSelectedColumnSpace.id][fromColumnValue]) {
      relatedCellsTemp.data[currentSelectedColumnSpace.id][fromColumnValue] = {};
    }

    // 関連セル情報（relatedCellsオブジェクト）を設定
    for (const column of currentSelectedColumnSpace.columns.children) {
      const defaultCells = relatedCellsTemp.data[currentSelectedColumnSpace.id]?.[fromColumnValue]?.[fromCellValue];
      relatedCells[column.id] = (defaultCells && defaultCells[column.id]) ? {cellIds: defaultCells[column.id]} : {cellIds: []}; //NOTE: ここ汚くてごめん　cellIds消す方法わからなかったからつける
    }

    return {
      targetCell: {
        columnId: fromColumnValue,
        cellId: fromCellValue,
      },
      relatedCells,
    };

  }, [props.relatedCells, currentSelectedColumnSpace, fromColumnValue, fromCellValue]);

  // モーダル閉じる前のイベント
  const onCloseModal = useCallback(() => {

    // 状態のクリーンアップ
    // setCurrentColumnFromCellOptions([]); //NOTE: これだけまた最後同じカラムスペースでモーダル開くかもなので残してみる
    setFromColumnValue(null);
    setFromCellValue(null);
    setToColumnValue(null);
    setCurrentCell(null);

    // propsで渡されたonCloseを最後に発火
    props.onClose();
  }, []);

  if (!initialValues) {
    //TODO ここもう少しなんとかできると思う。そもそも必要かも含め後で
    return (
      <div>読込中</div>
    )
  }

  return (
    <Modal isOpen={props.isOpen} onClose={onCloseModal} size="6xl" closeOnEsc={false} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{currentSelectedColumnSpace.name}のリレーション</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            onSubmit={async (values) => {
              props.onSubmit(values, currentSelectedColumnSpace.id);
            }}
            validationSchema={validationSchema}
          >{(formState) => {
            return (
              <Form>
                <div className="flex flex-row">

                  {/* 関連元カラムとセル */}
                  <div className="w-1/2 pr-3 pb-12">
                    <div className="mb-1 font-bold">対象セル</div>
                    <FieldArray name="targetCell">
                      {() => (
                        <div className="flex flex-col ml-5">

                          {/* 関連元カラム */}
                          <div className="flex flex-col">
                            <div>カラム</div>
                            <div className="mt-1 ml-4">
                              <Field
                                name="targetCell.columnId"
                                component={CustomSelect}
                                placeholder="カラムを選択"
                                options={currentFromColumnOptions}
                                value={fromColumnValue}
                                onChange={onChangeFromColumnId}
                              />
                              <ErrorMessage name={`targetCell.columnId`} component="div" className="field-error font-black text-red-700 text-sm"/>
                            </div>
                          </div>

                          {/* 関連元セル */}
                          <div className="flex flex-col mt-3 ">
                            <div>セル</div>
                            <div className="mt-1 ml-4">
                              {/* TODO ここはファイルカラムならちゃんとそのファイルを再生できるようにもしたい。できるのかな？画像ならstyleのbackground-imageをセットすることでできなくもなさそうだけどその他は無理かな。選択されてるやつを下にぼろっと表示するのはできるけどそれはやるか */}
                              <Field
                                name="targetCell.cellId"
                                component={CustomSelect}
                                placeholder="セルを選択"
                                options={currentColumnFromCellOptions}
                                value={fromCellValue}
                                onChange={onChangeFromCellId}
                              />
                              <ErrorMessage name={`targetCell.cellId`} component="div" className="field-error font-black text-red-700 text-sm"/>
                            </div>
                          </div>

                          {/* プレビュー */}
                          {currentCell &&
                            <div className="bg-gray-900 mt-4 pb-3 pt-2 rounded-2xl">
                              <CellInfo cell={currentCell}/>
                            </div>
                          }
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <div style={{width: "2px"}} className="bg-gray-600"></div>

                  {/* リレーション対象 */}
                  <div className="w-1/2 pl-4 pb-12">
                    <div className="mb-1 font-bold">リレーション対象</div>
                    <div className="flex flex-col ml-5">

                      <Select placeholder="カラムを選択" onChange={(e) => onChangeToColumnId(e, formState.setFieldValue)}>
                        {currentSelectedColumnSpace?.columns
                          .filterChildren(col => col.id !== fromColumnValue)
                          .map(col => {
                            const column = col as Column;
                            return (
                              <option key={column.id} value={column.id}  className={`${column.id === fromColumnValue ? "hidden" : ""}`}>
                                {column.name}
                              </option>
                            )
                          })
                        }
                      </Select>

                      {/* 関連先セル */}
                      <FieldArray name="relatedCells">
                        {() => (
                          <div className={`${!fromCellValue ? "hidden" : ""}  `}>
                            {currentSelectedColumnSpace.columns.mapChildren((col, columnIndex) => {
                                const column = col as Column;
                                // TODO パフォーマンスの問題でUXが微妙なのでいつか手を入れるかも
                                return (
                                  <div key={column.id} className={`${(column.id === fromColumnValue) ? "hidden" : ""}`}>  {/* NOTE: 今選択されているカラムIDを持たないのは表示しないがフォーム上値は存在させるためhidden化 */}
                                    <CheckboxContainer name={`relatedCells.${column.id}.cellIds`} className={`${(column.id !== toColumnValue) ? "hidden" : ""}`}>
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
                  </div>
                </div>

                {/* 各種ボタン */}
                <div className="float-right mt-3 mb-2">
                  <Button type="submit" colorScheme="blue" mr={3} isDisabled={!formState.isValid || formState.isSubmitting}>完了</Button>
                  <Button variant="ghost" onClick={onCloseModal}>キャンセル</Button>
                </div>
              </Form>

              )
            }}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>

  )
}
