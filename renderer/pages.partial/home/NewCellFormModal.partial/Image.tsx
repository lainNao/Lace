import { Button } from "@chakra-ui/react"
import React, { useCallback, useState } from 'react';
import { NewCellFormModalBodyProps } from "../ColumnSpaceExplorer";
import { useDropzone } from 'react-dropzone';
import { hasCompatibleImageExtension } from "../../../modules/validator";
import { useToast } from "@chakra-ui/react"

//TODO 同階層のTextと同じような感じに変更する
export const NewCellFormModalBodyImage: React.FC<NewCellFormModalBodyProps> = (props) => {

  const [paths, setPaths] = useState([]);
  const toast = useToast()

  const onDrop = useCallback(acceptedFiles => {
    // 対応する拡張子のみ受け入れる
    const acceptedFilePaths = Array.from<File>(acceptedFiles)
      .map(file => file.path)
      .filter(filepath => hasCompatibleImageExtension(filepath));

    if (acceptedFiles.length !== acceptedFilePaths.length) {
      toast({
        title: "未対応の拡張子のファイルは取り込みませんでした。", //TODO ここ不親切感あるので最終的にどうにかしたい
        status: "error",
        position: "bottom-right",
        isClosable: true,
        duration: 10000,
      });
    }

    setPaths(prev => [...prev, ...acceptedFilePaths])
  }, []);
  const { getRootProps, isDragActive } = useDropzone({onDrop});

  const handleSubmit = useCallback((e) => { //TODO 型
    e.preventDefault();
    e.stopPropagation();
    props.onClickCreateNewCell(props.columnData, paths);
  }, [paths]);

  //TODO アップロードしようとしたけどやめたファイルを「☓」ボタンで消せるようにする

  return (
    <form onSubmit={handleSubmit}>

      <div {...getRootProps()} className={`${isDragActive ? "border-gray-100" : "border-gray-500"} border-2 border-dashed  rounded-lg flex flex-col items-center text-center p-5`} >
        <div>追加したい画像ファイル（jpg、jpeg、png、gif、webp対応）をこのエリアにドラッグ＆ドロップしてから「登録」ボタンを押せば登録されます。</div>
        <div>
          {/* TODO このパスの名前切り抜くやつ、OS違うと駄目かもだから留意 */}
          {/* TODO ここでローカルファイルを画像表示するために「webSecurity: false」にしてるので、嫌ならあとでやめる */}
          {paths.map((filePath, index) => (
            <div key={index} className="flex flex-col items-center mt-5">
              {filePath.split("\\").pop()}<img src={filePath}></img>
            </div>
          ))}
        </div>
      </div>

      {/* 各種ボタン */}
      <div className="float-right mt-3 mb-2">
        <Button type="submit" isDisabled={!(paths.length)} colorScheme="blue" mr={3} >登録</Button>
        <Button variant="ghost" onClick={props.handleClickNewCellFormClose}>キャンセル</Button>
      </div>

    </form>
  )
}
