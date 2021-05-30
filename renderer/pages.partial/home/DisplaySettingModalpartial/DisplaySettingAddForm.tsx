import React from 'react';
import {
  Input,
  Select,
  IconButton,
  Button,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react"
import {  DisplayDetailCustomList, DisplaySetting, DisplaySettings } from '../../../models/DisplaySettings';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { useRecoilValue } from 'recoil';
import selectedColumnSpaceIdState from '../../../recoils/atoms/selectedColumnSpaceIdState';
import { Field, FieldArray, Form, Formik } from 'formik';
import yup from '../../../modules/yup';
import { RadioButtonGroup } from 'material-ui/RadioButton';
import { RelatedCellsDisplayType } from '../../../resources/RelatedCellsDisplayType';
import specificColumnSpaceState from '../../../recoils/selectors/specificColumnSpaceState';
import { useState } from 'react';

type Props = {
  displaySettings: DisplaySettings,
}

const notNullableStringRule = yup.string().min(1).required("必須です").filled("必須です");

//TODO 「ソートカラムはメインカラムと違う必要がある」的な仕様が漏れ出してるけどどうすればいいんだろう　仕様クラスとかモデルに入れるとかisValidだとかドメインサービスだとかいろいろあるので考える

export const DisplaySettingAddForm = (props: Props) => {
  const currentSelectedColumnSpaceId = useRecoilValue(selectedColumnSpaceIdState);
  const currentSelectedColumnSpace = useRecoilValue(specificColumnSpaceState(currentSelectedColumnSpaceId));

  const handleOnChangeMainColumn = (event, setFieldValue, currentTypeDetailsColumnLength?: number) => {  //TODO 型
    setFieldValue("mainColumn", event.target.value);
    setFieldValue("sortColumns", [""]);
    if (currentTypeDetailsColumnLength) {
      for (let i=0; i<currentTypeDetailsColumnLength; i++) {
        setFieldValue(`relatedCellsDisplaySettings.typeDetails.columns.${i}.columnId`, "");
      }
    }
  }

  const handleOnChangeSortColumn = (event, index: number, setFieldValue, currentTypeDetailsColumnLength?: number) => {  //TODO 型
    setFieldValue(`sortColumns.${index}`, event.target.value);
    if (currentTypeDetailsColumnLength) {
      for (let i=0; i<currentTypeDetailsColumnLength; i++) {
        setFieldValue(`relatedCellsDisplaySettings.typeDetails.columns.${i}.columnId`, "");
      }
    }
  }

  return (

    <Formik
      enableReinitialize={true}
      initialValues={{
        name: "",
        mainColumn: "",
        sortColumns: [""],
        relatedCellsDisplaySettings: {
          type: null,
          typeDetails: null,
        }
      }}
      onSubmit={async (values) => {
        console.log("-------------------submit----------------------")
        console.debug(values)
        console.log("-----------------------------------------")
        // TODO ソートカラムのかぶりはじきでエラートースト出すのはここで自前で行うしかないかな
        // props.onSubmit(values, props.currentSelectedColumnSpace.id);
      }}
      validationSchema={
        yup.object({
          name: notNullableStringRule,
          mainColumn: notNullableStringRule,
          sortColumns: yup.array(notNullableStringRule).required(),
          relatedCellsDisplaySettings: yup.object({
            type: notNullableStringRule,
            typeDetails: yup.object().when("type", type => {
              console.log(type)
              if (type === "HListSeparator") {
                return yup.object({
                  separator: yup.string().required("必須です"),
                });
              }
              if (type === "CustomList") {
                return yup.object({
                  title: notNullableStringRule,
                  columns: yup.array(yup.object({
                    columnId: notNullableStringRule,
                    prefix: yup.string().nullable(),
                    suffix: yup.string().nullable(),
                    needBreakLine: yup.bool().required("必須です"),
                  })).min(1).max(DisplaySetting.MAX_SORT_COLUMN_LENGTH).required()
                });
              }
              return yup.object().nullable();
            })
          })
        })
      }
    >
      {(formState) => {
        console.log(formState.values, formState.touched, formState.errors)
        return (
          <Form>
            {/* 中央 */}
            <div className="font-bold">中央</div>
            <div className="pl-4 mt-3">

              {/* 表示名 */}
              <div className="flex flex-row">
                <div className="w-1/3">表示名</div>
                <div className="w-2/3">
                  <Field name="name">
                    {({field, form, ...props}) => <Input {...field} {...props} spelCheck={false} isInvalid={formState.touched.name && formState.errors.name}/>}
                  </Field>
                </div>
              </div>

              {/* メインカラム */}
              <div className="flex flex-row mt-3">
                <div className="w-1/3">メインカラム</div>
                <div className="w-2/3">
                  <Field name="mainColumn">
                    {({field, form, ...props}) => (
                      <Select {...field} {...props} placeholder="選択してください" isInvalid={formState.touched.mainColumn && formState.errors.mainColumn} onChange={e => handleOnChangeMainColumn(e, formState.setFieldValue, formState.values.relatedCellsDisplaySettings.typeDetails?.columns?.length)}>
                        {currentSelectedColumnSpace.columns.mapChildren(column => {
                          return <option value={column.id}>{column.name}</option>
                        })}
                      </Select>
                    )}
                  </Field>
                </div>
              </div>

              {/* ソートカラム */}
              <div className="flex flex-row mt-3">
                <div className="w-1/3">ソートカラム</div>
                <div className="w-2/3">
                  <FieldArray name="sortColumns">
                    {({remove, push}) => (
                      <div>
                        {formState.values.sortColumns.length > 0 && formState.values.sortColumns.map((sortColumn, index) => {
                          return (
                            <div className={`${index !== 0 && "mt-2"}`}>
                              <Field name={`sortColumns.${index}`} key={index}>
                                {({field, form, ...props}) => (
                                  <Select {...field} {...props} placeholder="選択してください" isInvalid={formState.touched.sortColumns?.[index] && formState.errors.sortColumns?.[index]} onChange={e => handleOnChangeSortColumn(e, index, formState.setFieldValue, formState.values.relatedCellsDisplaySettings.typeDetails?.columns?.length)}>
                                    {currentSelectedColumnSpace.columns.children
                                      .filter(column => column.id !== formState.values.mainColumn)
                                      .map(column => <option value={column.id}>{column.name}</option>)}
                                  </Select>
                                )}
                              </Field>
                            </div>
                          )
                        })}

                        {/* 削除ボタン・追加ボタン */}
                        <div className="mt-2">
                          <IconButton disabled={formState.values.sortColumns.length <= DisplaySetting.MIN_SORT_COLUMN_LENGTH} aria-label="remove" icon={<MinusIcon />} onClick={() => {
                            if (formState.values.sortColumns.length <= DisplaySetting.MIN_SORT_COLUMN_LENGTH) return;
                            remove(formState.values.sortColumns.length-1)
                          }} />
                          <IconButton disabled={!DisplaySetting.isValidSortColumnLength(formState.values.sortColumns.length)} className="ml-3" aria-label="add" icon={<AddIcon />} onClick={() => push("")} />
                        </div>

                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>

            </div>

            {/* 右サイド */}
            <div className="font-bold">右サイド</div>
            <div className="pl-4 mt-3">

              {/* 関連セル表示形式 */}
              <div className="flex flex-row mt-3">
                <div className="w-1/3">関連セル表示形式</div>
                <div className="w-2/3">
                  <Field name={`relatedCellsDisplaySettings.type`}>
                    {({field, form, ...props}) => (
                      <Select {...field} {...props} placeholder="選択してください" isInvalid={formState.touched.relatedCellsDisplaySettings?.type && formState.errors.relatedCellsDisplaySettings?.type}>
                        {Object.entries(RelatedCellsDisplayType).map(([key, value]) => <option value={value}>{value}</option>)}
                      </Select>
                    )}
                  </Field>
                </div>
              </div>

              {/* HListSeparatorの場合 */}
              {formState.values.relatedCellsDisplaySettings.type === "HListSeparator" &&

                // セパレータ
                <div className="flex flex-row mt-3">
                  <div className="w-1/3">セパレータ</div>
                  <div className="w-2/3">
                    <Field name={`relatedCellsDisplaySettings.typeDetails.separator`}>
                      {({field, form, ...props}) => {
                        return (
                          <Input {...field} {...props} spelCheck={false} isInvalid={(formState.touched.relatedCellsDisplaySettings?.typeDetails as any)?.separator && (formState.errors.relatedCellsDisplaySettings?.typeDetails as any)?.separator}/>
                        )
                      }}
                    </Field>
                  </div>
                </div>
              }

              {/* CustomListの場合 */}
              {formState.values.relatedCellsDisplaySettings.type === "CustomList" &&
                <div>
                  {/* タイトル */}
                  <div className="flex flex-row mt-3">
                    <div className="w-1/3">タイトル</div>
                    <div className="w-2/3">
                      <Field name="relatedCellsDisplaySettings.typeDetails.title">
                        {({field, form, ...props}) => <Input {...field} {...props} spelCheck={false} isInvalid={(formState.touched.relatedCellsDisplaySettings?.typeDetails as any)?.title && (formState.errors.relatedCellsDisplaySettings?.typeDetails as any)?.title}/>}
                      </Field>
                    </div>
                  </div>

                  <div className="w-1/3 mt-3">表示に含める情報</div>
                  <div className=" ml-5 py-1 mt-2">
                    <FieldArray name="relatedCellsDisplaySettings.typeDetails.columns">
                      {({remove, push}) => {

                        // １つ目の入力フォームを出すため、空の初期データを用意してあげる
                        if (!formState.values.relatedCellsDisplaySettings?.typeDetails?.columns?.length) {
                          push({
                            columnId:"",
                            prefix: "",
                            suffix: "",
                            needBreakLine: false,
                          })
                          return null;
                        }

                        return (
                          <div>
                            {formState.values.relatedCellsDisplaySettings?.typeDetails?.columns?.length
                             && formState.values.relatedCellsDisplaySettings.typeDetails.columns.map((column, index) => {
                              return (
                                <div className={`${index !== 0 && "mt-2"}  bg-gray-900 rounded-xl px-4 py-4 pb-5`}>

                                  {/* 第nカラム */}
                                  <div className={`flex flex-row mt-3 `}>
                                    <div className="w-1/3">第{index+1}カラム</div>
                                    <div className="w-2/3">
                                      <Field name={`relatedCellsDisplaySettings.typeDetails.columns.${index}.columnId`}>
                                        {({field, form, ...props}) => (
                                          <Select {...field} {...props} placeholder="選択してください" isInvalid={(formState.touched.relatedCellsDisplaySettings?.typeDetails as any)?.columns?.[index]?.columnId && (formState.errors.relatedCellsDisplaySettings?.typeDetails as any)?.columns?.[index]?.columnId}>
                                            {currentSelectedColumnSpace.columns.children
                                              .filter(column => column.id !== formState.values.mainColumn)
                                              .filter(column => {
                                                if (!formState.values.sortColumns) {
                                                  return true;
                                                }
                                                return !formState.values.sortColumns.includes(column.id);
                                              })
                                              .map(column => <option value={column.id}>{column.name}</option>)
                                            }
                                          </Select>
                                      )}
                                      </Field>
                                    </div>
                                  </div>

                                  {/* プレフィクス */}
                                  <div className="flex flex-row mt-3">
                                    <div className="w-1/3">プレフィクス</div>
                                    <div className="w-2/3">
                                      <Field name={`relatedCellsDisplaySettings.typeDetails.columns.${index}.prefix`}>
                                        {({field, form, ...props}) => <Input {...field} {...props} spelCheck={false} isInvalid={(formState.touched.relatedCellsDisplaySettings?.typeDetails as any)?.columns?.[index]?.prefix && (formState.errors.relatedCellsDisplaySettings?.typeDetails as any)?.columns?.[index]?.prefix}/>}
                                      </Field>
                                    </div>
                                  </div>

                                  {/* サフィックス */}
                                  <div className="flex flex-row mt-3">
                                    <div className="w-1/3">サフィックス</div>
                                    <div className="w-2/3">
                                      <Field name={`relatedCellsDisplaySettings.typeDetails.columns.${index}.suffix`}>
                                        {({field, form, ...props}) => <Input {...field} {...props} spelCheck={false} isInvalid={(formState.touched.relatedCellsDisplaySettings?.typeDetails as any)?.columns?.[index]?.suffix && (formState.errors.relatedCellsDisplaySettings?.typeDetails as any)?.columns?.[index]?.suffix}/>}
                                      </Field>
                                    </div>
                                  </div>

                                  {/* 改行＆インデント */}
                                  <div className="flex flex-row mt-3">
                                    <div className="w-1/3">改行＆インデント</div>
                                    <div className="w-2/3">
                                      <RadioGroup defaultValue="false">
                                        <Stack direction="row">
                                          <Field name={`relatedCellsDisplaySettings.typeDetails.columns.${index}.needBreakLine`}>{({ field, form, ...props }) => <Radio isInvalid={(formState.touched.relatedCellsDisplaySettings?.typeDetails as any)?.columns?.[index]?.needBreakLine && (formState.errors.relatedCellsDisplaySettings?.typeDetails as any)?.columns?.[index]?.needBreakLine} {...field} {...props} value="true">あり</Radio>}</Field>
                                          <Field name={`relatedCellsDisplaySettings.typeDetails.columns.${index}.needBreakLine`}>{({ field, form, ...props }) => <Radio isInvalid={(formState.touched.relatedCellsDisplaySettings?.typeDetails as any)?.columns?.[index]?.needBreakLine && (formState.errors.relatedCellsDisplaySettings?.typeDetails as any)?.columns?.[index]?.needBreakLine} {...field} {...props} value="false">なし</Radio>}</Field>
                                        </Stack>
                                      </RadioGroup>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}


                            {/* 追加ボタン */}
                            <div className="flex flex-row mt-3 justify-center">
                              <div>
                                <IconButton disabled={formState.values.relatedCellsDisplaySettings.typeDetails.columns.length <= DisplayDetailCustomList.MIN_COLUMN_LENGTH} aria-label="remove" icon={<MinusIcon />} onClick={() => {
                                  if (formState.values.relatedCellsDisplaySettings.typeDetails.columns <= DisplayDetailCustomList.MIN_COLUMN_LENGTH) return;
                                  remove(formState.values.relatedCellsDisplaySettings.typeDetails.columns -1)
                                }} />
                                <IconButton disabled={DisplayDetailCustomList.isValidColumnLength(formState.values.relatedCellsDisplaySettings.typeDetails.columns.length)} className="ml-3" aria-label="add" icon={<AddIcon />} onClick={() => push({
                                  columnId:"",
                                  prefix: "",
                                  suffix: "",
                                  needBreakLine: false,
                                })} />
                              </div>
                            </div>

                          </div>
                        )
                      }}
                    </FieldArray>
                  </div>

                </div>
              }

              <div className="text-right mt-6">
              <Button type="submit" colorScheme="blue" mr={3} isDisabled={!formState.dirty || !formState.isValid || formState.isSubmitting}>確定</Button>
                {/* <Button type="submit" colorScheme="blue" mr={3} >確定</Button> */}
              </div>

            </div>
          </Form>
        )
      }}
    </Formik>
  )
}