import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure } from "@chakra-ui/react"
import React, { useCallback, useState } from 'react';
import useSetupRelatedCells from "../../../hooks/useSetupRelatedCells";
import { NewCellFormModalBodyProps } from "../ColumnSpaceExplorer";
import { useDropzone } from 'react-dropzone';
import { hasCompatibleImageExtension } from "../../../modules/validator";

// TODO ここ、同じカラムスペースのカラム達をデータで持ってきて、関連セルを選択させるようなUIにすることが必要　そのUIどういう見た目にしてどういう実装ができるのか問題がある　そのデータはオブジェクトの配列でユースケースに送るんだろうけど　結構重労働なところだ…
// TODO そのUIたぶんマルチモーダルがいい（別ウィンドウは表示位置とかで結局UX悪そう）　マルチモーダルを頑張って…　でその出す新しいモーダルでは、同一カラムスペースにあるカラムを選択するセレクトボックスが一個あって、それを選択するとセル一覧が並ぶ感じだと思う　無限スクロール対策したほうがいいと思う
export const NewCellFormModalBodyImage: React.FC<NewCellFormModalBodyProps> = (props) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [relatedCells, setRelatedCells] = useSetupRelatedCells();
  const [modifiedRelatedCells, setModifiedRelatedCells] = useState(false);
  const [paths, setPaths] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    // 対応する拡張子のみ受け入れる
    const acceptedFilePaths = Array.from<File>(acceptedFiles)
      .map(file => file.path)
      .filter(filepath => hasCompatibleImageExtension(filepath));

    setPaths(prev => [...prev, ...acceptedFilePaths])
  }, []);
  const { getRootProps, isDragActive } = useDropzone({onDrop});

  const handleSubmit = useCallback((e) => { //TOOD 型
    e.preventDefault();
    e.stopPropagation();

    props.onClickCreateNewCell(
      props.columnData,
      paths,
      (modifiedRelatedCells) ? relatedCells : null,
    );

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
