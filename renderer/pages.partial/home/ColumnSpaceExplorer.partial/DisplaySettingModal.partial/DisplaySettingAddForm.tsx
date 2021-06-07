import React from 'react';
import { Input, Select, IconButton, Button, useToast } from "@chakra-ui/react"
import { DisplaySetting } from '../../../../models/DisplaySettings';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import selectedColumnSpaceIdState from '../../../../recoils/atoms/selectedColumnSpaceIdState';
import { Field, FieldArray, Form, Formik } from 'formik';
import yup from '../../../../modules/yup';
import specificColumnSpaceState from '../../../../recoils/selectors/specificColumnSpaceState';
import displaySettingsState from '../../../../recoils/atoms/displaySettingsState';
import { createDisplaySettingUsecase } from '../../../../usecases/createDisplaySettingUsecase';
import { HListDisplayType, RelatedCellDisplayDirectionType } from '../../../../models/DisplaySettings/RelatedCellsDisplaySetting';

const notNullableStringRule = yup.string().min(1).required("必須です").filled("必須です");

//TODO 「ソートカラムはメインカラムと違う必要がある」的な仕様が漏れ出してるけどどうすればいいんだろう　仕様クラスとかモデルに入れるとかisValidだとかドメインサービスだとかいろいろあるので考える
//TODO このFormikの警告どうすんだ…「Warning: Cannot update a component (`Formik`) while rendering a different component (`FieldArrayInner`). To locate the bad setState() call inside `FieldArrayInner`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render」
export const DisplaySettingAddForm = () => {
  const currentSelectedColumnSpaceId = useRecoilValue(selectedColumnSpaceIdState);
  const currentSelectedColumnSpace = useRecoilValue(specificColumnSpaceState(currentSelectedColumnSpaceId));
  const toast = useToast();

  const handleOnChangeMainColumn = (event, setFieldValue, relatedCellsDisplaySettings?: number) => {  //TODO 型
    console.debug("メインカラムonchange")
    setFieldValue("mainColumn", event.target.value);
    setFieldValue("sortColumns", [""]);
    if (relatedCellsDisplaySettings) {
      for (let i=0; i<relatedCellsDisplaySettings; i++) {
        setFieldValue(`relatedCellsDisplaySettings.${i}.columnId`, "");
      }
    }
  }

  const handleOnChangeSortColumn = (event, index: number, setFieldValue, relatedCellsDisplaySettings?: number) => {  //TODO 型
    console.debug("ソートカラムonchange")
    setFieldValue(`sortColumns.${index}`, event.target.value);
    if (relatedCellsDisplaySettings) {
      for (let i=0; i<relatedCellsDisplaySettings; i++) {
        setFieldValue(`relatedCellsDisplaySettings.${i}.columnId`, "");
      }
    }
  }

  const handleSubmitDisplaySettingAddForm = useRecoilCallback(({set}) => async (values, {setSubmitting, setErrors, setStatus, resetForm}) => {
    console.debug("submit");

    /// 現在のカラムスペース用の表示設定を一つ追加
    try {
      setSubmitting(true);
      const displaySetting = DisplaySetting.createNewFromJSON(values);
      const newDisplaySettings = await createDisplaySettingUsecase(currentSelectedColumnSpaceId, displaySetting);
      set(displaySettingsState, newDisplaySettings);
      toast({ title: "追加しました", status: "success", position: "bottom-right", isClosable: true, duration: 1500 });
      resetForm();
      setStatus({success: true})
    } catch (e) {
      console.log(e.stack);
      toast({ title: e.message, status: "error", position: "bottom-right", isClosable: true, duration: 10000});
      setStatus({success: false})
    } finally {
      setSubmitting(false);
    }

  }, [currentSelectedColumnSpaceId]);

  return (

    <Formik
      enableReinitialize={true}
      initialValues={{
        name: "",
        mainColumn: "",
        sortColumns: [""],
        relatedCellsDisplaySettings: [{
          columnId: "",
          direction: "Vertical",
        }]
      }}
      onSubmit={(values, {setSubmitting, setErrors, setStatus, resetForm}) => handleSubmitDisplaySettingAddForm(values, {setSubmitting, setErrors, setStatus, resetForm})}
      validationSchema={
        yup.object({
          name: notNullableStringRule,
          mainColumn: notNullableStringRule,
          sortColumns: yup.array(notNullableStringRule).required("必須です").unique("同時に同じものを指定できません").min(DisplaySetting.MIN_SORT_COLUMN_LENGTH).max(DisplaySetting.MAX_SORT_COLUMN_LENGTH),
          relatedCellsDisplaySettings: yup.array(
            yup.object({
              columnId: notNullableStringRule,
              direction: notNullableStringRule,
              hListDisplayType: yup.string().when("direction", direction => {
                if (direction === RelatedCellDisplayDirectionType.Horizontal) {
                  return notNullableStringRule;
                }
                return yup.string().nullable();
              }),
              hListSeparator: yup.string().nullable(),
            })
          ).min(DisplaySetting.MIN_RELATED_CELLS_DISPLAY_SETTINGS_LENGTH)
            .max(DisplaySetting.MAX_RELATED_CELLS_DISPLAY_SETTINGS_LENGTH)
            .required()
            .test("is-column-unique", "第nカラムは同時に同じものを指定できません", (value, context) => {
              if (!value) {
                return false;
              }

              let columnIds = [];
              return value.every(column => {
                if (columnIds.includes(column.columnId)) {
                  return false;
                }
                columnIds.push(column.columnId);
                return true;
              })
            })
        })
      }
    >
      {(formState) => {
        return (
          <Form>
            {/* 中央 */}
            <div className="font-bold">中央ペイン</div>
            <div className="pl-4 mt-3">

              {/* 表示名 */}
              <div className="flex flex-row">
                <div className="w-1/3">表示名</div>
                <div className="w-2/3">
                  <Field name="name">
                    {({field, form, ...props}) => <Input {...field} {...props} spellCheck={false} isInvalid={formState.touched.name && formState.errors.name}/>}
                  </Field>
                </div>
              </div>

              {/* メインカラム */}
              <div className="flex flex-row mt-3">
                <div className="w-1/3">メインカラム</div>
                <div className="w-2/3">
                  <Field name="mainColumn">
                    {({field, form, ...props}) => (
                      <Select
                        {...field} {...props}
                        placeholder="選択してください"
                        isInvalid={formState.touched.mainColumn && formState.errors.mainColumn}
                        onChange={e => handleOnChangeMainColumn(e, formState.setFieldValue, formState.values.relatedCellsDisplaySettings.length)}
                      >
                        {currentSelectedColumnSpace.columns.mapChildren(column => {
                          return <option key={column.id} value={column.id}>{column.name}</option>
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
                            <div key={index} className={`${index !== 0 && "mt-2"}`}>
                              <Field name={`sortColumns.${index}`} key={index}>
                                {({field, form, ...props}) => (
                                  <Select
                                    {...field} {...props}
                                    placeholder="選択してください"
                                    isInvalid={formState.touched.sortColumns?.[index] && formState.errors.sortColumns?.[index]}
                                    onChange={e => handleOnChangeSortColumn(e, index, formState.setFieldValue, formState.values.relatedCellsDisplaySettings.length)}
                                  >
                                    {currentSelectedColumnSpace.columns.children
                                      .filter(column => column.id !== formState.values.mainColumn)
                                      .map(column => <option key={column.id} value={column.id}>{column.name}</option>)}
                                  </Select>
                                )}
                              </Field>
                            </div>
                          )
                        })}

                        {/* エラーメッセージ */}
                        <div className="flex justify-center">
                          {(formState.errors.sortColumns &&
                            typeof formState.errors.sortColumns === "string") &&
                            <div className="text-red-600">{formState.errors.sortColumns}</div>
                          }
                        </div>

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
            <div className="font-bold">関連セルペイン</div>
            <div className="pl-4 mt-3">

              <FieldArray name="relatedCellsDisplaySettings">
                {({remove, push}) => {
                  return (
                    <div>
                      {formState.values.relatedCellsDisplaySettings.map((relatedCellsDisplaySetting, index) => {
                        return (
                          <div key={relatedCellsDisplaySetting.columnId + index} className={`${index !== 0 && "mt-2"} bg-gray-900 rounded-xl px-4 py-4 pb-5`}>

                            {/* カラム */}
                            <div className="flex flex-row mt-3">
                              <div className="w-1/3">第{index+1}カラム</div>
                              <div className="w-2/3">
                                <Field name={`relatedCellsDisplaySettings.${index}.columnId`}>
                                  {({field, form, ...props}) => (
                                    <Select
                                      {...field} {...props}
                                      placeholder="選択してください"
                                      isInvalid={formState.touched.relatedCellsDisplaySettings?.[index]?.columnId && (formState.errors.relatedCellsDisplaySettings?.[index] as any)?.columnId}
                                    >
                                      {currentSelectedColumnSpace.columns.children
                                        // メインカラムに含まれない
                                        .filter(column => column.id !== formState.values.mainColumn)
                                        // ソートカラムに含まれない
                                        .filter(column => {
                                          if (!formState.values.sortColumns) {
                                            return true;
                                          }
                                          return !formState.values.sortColumns.includes(column.id);
                                        })
                                        .map(column => <option key={column.id} value={column.id}>{column.name}</option>)
                                      }
                                    </Select>
                                  )}
                                </Field>
                              </div>
                            </div>

                            {/* リスト表示時の方向 */}
                            <div className="flex flex-row mt-3">
                              <div className="w-1/3">リスト表示時の方向</div>
                              <div className="w-2/3">
                                <Field name={`relatedCellsDisplaySettings.${index}.direction`}>
                                  {({field, form, ...props}) => (
                                    <Select
                                      {...field} {...props}
                                      placeholder="選択してください"
                                      isInvalid={formState.touched.relatedCellsDisplaySettings?.[index]?.direction && (formState.errors.relatedCellsDisplaySettings?.[index] as any)?.direction}
                                    >
                                      {Object.entries(RelatedCellDisplayDirectionType).map(([key, value]) => <option key={key} value={value}>{value}</option>)}
                                    </Select>
                                  )}
                                </Field>
                              </div>
                            </div>

                            {/* 横表示の場合 */}
                            {formState.values.relatedCellsDisplaySettings?.[index]?.direction === RelatedCellDisplayDirectionType.Horizontal && (
                              <>
                                <div className="flex flex-row mt-3">
                                  <div className="w-1/3">表示タイプ</div>
                                  <div className="w-2/3">
                                    <Field name={`relatedCellsDisplaySettings.${index}.hListDisplayType`}>
                                      {({field, form, ...props}) => (
                                        <Select
                                          {...field} {...props}
                                          placeholder="選択してください"
                                          isInvalid={(formState.touched.relatedCellsDisplaySettings?.[index] as any)?.hListDisplayType && (formState.errors.relatedCellsDisplaySettings?.[index] as any)?.hListDisplayType}
                                        >
                                          {Object.entries(HListDisplayType).map(([key, value]) =>
                                            <option
                                              key={key}
                                              value={value}
                                            >
                                              {value}
                                            </option>)
                                          }
                                        </Select>
                                      )}
                                    </Field>
                                  </div>
                                </div>

                                <div className="flex flex-row mt-3">
                                  <div className="w-1/3">セパレータ</div>
                                  <div className="w-2/3">
                                    <Field name={`relatedCellsDisplaySettings.${index}.hListSeparator`}>
                                      {({field, form, ...props}) =>
                                        <Input {...field} {...props}
                                          spellCheck={false}
                                          isInvalid={(formState.touched.relatedCellsDisplaySettings?.[index] as any)?.hListSeparator && (formState.errors.relatedCellsDisplaySettings?.[index] as any)?.hListSeparator}
                                        />
                                      }
                                    </Field>
                                  </div>
                                </div>

                              </>

                            )}

                          </div>
                        )
                       })
                      }

                      {/* - + ボタン */}
                      <div className="flex flex-row mt-3 justify-center">
                        <div>
                          <IconButton disabled={formState.values.relatedCellsDisplaySettings.length <= DisplaySetting.MIN_RELATED_CELLS_DISPLAY_SETTINGS_LENGTH} aria-label="remove" icon={<MinusIcon />} onClick={() => {
                            if (formState.values.relatedCellsDisplaySettings.length <= DisplaySetting.MIN_RELATED_CELLS_DISPLAY_SETTINGS_LENGTH) return;
                            remove(formState.values.relatedCellsDisplaySettings.length -1)
                          }} />
                          <IconButton disabled={formState.values.relatedCellsDisplaySettings.length === DisplaySetting.MAX_RELATED_CELLS_DISPLAY_SETTINGS_LENGTH} className="ml-3" aria-label="add" icon={<AddIcon />} onClick={() => push({
                            columnId:"",
                            direction: "Vertical",
                          })} />
                        </div>
                      </div>

                    </div>
                  )
                }}
              </FieldArray>

              <div className="text-right mt-6">
                <Button type="submit" colorScheme="blue" mr={3} isDisabled={!formState.dirty || !formState.isValid || formState.isSubmitting}>追加</Button>
              </div>

            </div>
          </Form>
        )
      }}
    </Formik>
  )
}