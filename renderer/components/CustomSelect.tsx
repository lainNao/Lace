import { FieldProps } from "formik";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { OptionsType } from "react-select";
import { ControlProps } from 'react-select/src/components/Control'
import { OptionProps } from 'react-select/src/components/Option'
import { ValueType } from 'react-select/src/types'

//TODO 重かったらreact-select-virtualizedに移行する。というか重くなるので移行する。ただしreact-select-virtualizedのほうがバージョン問題で対応してない場合自分でどうにかするなどする
//TODO スタイルがちょっと普通のselectと違うのどうにかしたい。あとここだけでもtailwindやchakraへの依存を無くしたいさすがに。テーマへの依存は分かるけど
//TODO 下矢印の位置が変になってる
//NOTE: baseの値は、関数にしてconsole.logすれば分かるのでそれを目安にいじればいい
const customStylesDark = {
  control: (base, state) => ({
    ...base,
    background: "inherit",
    borderRadius: 6,
    borderColor: "rgb(255 255 255 / 16%)",
    boxShadow: state.isFocused ? null : null, // Removes weird border around container
    "&:hover": {
      borderColor: state.isFocused ? "rgb(59 130 246 / 50%)" : "rgb(255 255 255 / 25%)" // Overwrittes the different states of border
    }
  }),
  input: base => ({
    ...base,
    marginLeft: "7px",
    color: "white",
  }),
  placeholder: base => ({
    fontColor: "white",
    marginLeft: "7px",
    fontSize: "16px",
  }),
  indicatorSeparator: base => ({
    display: "none"
  }),
  indicatorsContainer: base => ({
    ...base,
    width: "40px",
    display: "flex",
    justifyContent: "center",
  }),
  dropdownIndicator: base => ({
    scale: "50%",
    fontSize: "5px",
    display: "flex",
    justifyContent: "center",
    "& svg": {
      width: "16px",
    },
  }),
  menu: base => ({
    ...base,
    borderRadius: 0,
    fontColor: "white",
    backgroundColor: "inherit" ,
    // kill the gap
    marginTop: 0,
  }),
  menuList: base => ({
    ...base,
    padding: 0, // kill the white space on first and last option
    backgroundColor: "var(--chakra-colors-gray-700)" ,
    borderWidth: "thin",
    borderColor: "rgba(255, 255, 255, 0.16)",
    fontSize: "small",
    // 影
    "--tw-shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    boxShadow: "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)",
  }),
  singleValue: (base, state) => ({
    marginLeft: "8px",
    fontSize: "15px",
  }),
  option: (base, state) => ({
    ...base,
    paddingTop: "3px",
    paddingBottom: "3px",
    backgroundColor: state.isSelected ? "lightseagreen" : "inherit",
    "&:hover": {
      backgroundColor: "lightseagreen"
    }
  }),
};


interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps extends FieldProps {
  placeholder: string,
  options: OptionsType<Option>;
  isMulti?: boolean;
  field: any, //TODO 何の型
  value: any,
  onChange: any,
}


//TODO 追加機能としてCreatableにするのもいいかも
//NOTE: https://gist.github.com/hubgit/e394e9be07d95cd5e774989178139ae8#gistcomment-3620301
export const CustomSelect = (props: CustomSelectProps) => {

  const [currentValue, setCurrentValue] = useState<ValueType<Option,any>>(null)

  const onChange = (option: Option) => {
    props.form.setFieldValue(props.field.name, option.value);
    setCurrentValue(option)
    props.onChange(option.value, props.form.setFieldValue)
  };

  // 親から渡された値が空値になってたら、選択状態を空にする
  useEffect(() => {
    if (props.value) return;
    props.form.setFieldValue(props.field.name, "");
    setCurrentValue(null);
  }, [props.value])

  return (
    <Select
      styles={customStylesDark}
      name={props.field.name}
      value={currentValue}
      onChange={onChange}
      options={props.options.length > 0 ? props.options : []}
      placeholder={props.placeholder}
    />
  );
};
