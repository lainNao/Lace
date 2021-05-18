import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure } from "@chakra-ui/react"
import React, { useCallback, useState } from 'react';
import useSetupRelatedCells from "../../../hooks/useSetupRelatedCells";
import { NewCellFormModalBodyProps } from "../ColumnSpaceExplorer";
import { useDropzone } from 'react-dropzone';
import { hasCompatibleSoundExtension } from "../../../modules/validator";
import { useToast } from "@chakra-ui/react"

// TODO ここ、同じカラムスペースのカラム達をデータで持ってきて、関連セルを選択させるようなUIにすることが必要　そのUIどういう見た目にしてどういう実装ができるのか問題がある　そのデータはオブジェクトの配列でユースケースに送るんだろうけど　結構重労働なところだ…
// TODO そのUIたぶんマルチモーダルがいい（別ウィンドウは表示位置とかで結局UX悪そう）　マルチモーダルを頑張って…　でその出す新しいモーダルでは、同一カラムスペースにあるカラムを選択するセレクトボックスが一個あって、それを選択するとセル一覧が並ぶ感じだと思う　無限スクロール対策したほうがいいと思う
export const NewCellFormModalBodySound: React.FC<NewCellFormModalBodyProps> = (props) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [relatedCells, setRelatedCells] = useSetupRelatedCells();
  const [modifiedRelatedCells, setModifiedRelatedCells] = useState(false);
  const [paths, setPaths] = useState([]);
  const toast = useToast()

  const onDrop = useCallback(acceptedFiles => {
    // 対応する拡張子
    const acceptedFilePaths = Array.from<File>(acceptedFiles)
      .map(file => file.path)
      .filter(filepath => hasCompatibleSoundExtension(filepath));

    if (acceptedFiles.length !== acceptedFilePaths.length) {
      toast({
        title: "未対応の拡張子のファイルは取り込みませんでした。", //TODO ここ不親切感あるので最終的にどうにかしたい
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }

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

      <div {...getRootProps()} className={`${isDragActive ? "border-gray-100" : "border-gray-500"} border-2 border-dashed  rounded-lg flex flex-col p-5`} >
        <div className="text-center">追加したい音声ファイル（mp3、ogg、m4a対応）をこのエリアにドラッグ＆ドロップしてから「登録」ボタンを押せば登録されます。</div>

        {paths.length > 0 &&
        <div className="mt-3 font-thin text-xs">
          <ul>
            {/* TODO このパスの名前切り抜くやつ、OS違うと駄目かもだから留意 */}
            {/* TODO ここでローカルファイルを画像表示するために「webSecurity: false」にしてるので、嫌ならあとでやめる */}
            {/* TODO 再生ボタンを横に一応つけたいところ */}
            {paths.map((filePath, index) => (
              <li key={index} className="mt-2">
                {filePath.split("\\").pop()}
              </li>
            ))}
          </ul>
        </div>
        }
      </div>

      {/* 各種ボタン */}
      <div className="float-right mt-3 mb-2">
        {paths.length > 0 && (
          <div className="inline-block mr-3"><span className="font-black mx-1">{paths.length}</span><span className="text-sm">ファイル</span></div>
        )}
        <Button type="submit" isDisabled={!(paths.length)} colorScheme="blue" mr={3} >登録</Button>
        <Button variant="ghost" onClick={props.handleClickNewCellFormClose}>キャンセル</Button>
      </div>

    </form>
  )
}
