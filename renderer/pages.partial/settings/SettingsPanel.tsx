import { useSettingsPanelController } from "../../controllers/settings/useSettingsPanelController";
import { Button, Tooltip } from "@chakra-ui/react"
import { Progress, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption } from "@chakra-ui/react"
import { GlobalSettingKeys } from "../../models/GlobalSettings/GlobalSettings";
import React from "react";
import { QuestionCircleIcon } from "../../components/icons";

export const SettingsPanel = () => {
  const controller = useSettingsPanelController();

  if (!controller.globalSettings?.data) {
    return (
      <div>読込中</div>
    )
  }

  return (
    <div>

      <section>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>設定名</Th>
              <Th>値</Th>
            </Tr>
          </Thead>
          <Tbody>

          {/* データ保存先ディレクトリ */}
          <Tr>
            <Td>
              <div className="flex">
                <div>データ保存先ディレクトリ</div>
                <Tooltip label="このアプリケーションのメインデータを保存するディレクトリです。Cドライブ配下とかでなくDドライブ配下のどこかがよりよいのかもしれませんがどこでもいいです" aria-label="A tooltip">
                  <span><QuestionCircleIcon className="ml-1 h-5" /></span>
                </Tooltip>
              </div>
            </Td>
            <Td>
              {controller.saveDirPath}
              <Button className="ml-3" colorScheme="teal" size="sm" onClick={controller.handleClickCustomSaveDirPath}>変更</Button>
            </Td>
          </Tr>

          {/* 削除済みファイルのクリーンアップ */}
          <Tr>
            <Td>
              <div className="flex">
                <div>削除済みファイルのクリーンアップ</div>
                <Tooltip label="ゴミファイルをクリーンアップしてストレージサイズを削減します。（今は実装上の理由で、消されたファイルは全部裏でコピーされて2倍の容量で残っちゃってます。それを消します。ファイルをよく使って消してる人はやったら今までのファイルサイズの2倍のサイズのストレージ削減になります。バグってたらごめん）" aria-label="A tooltip">
                  <span><QuestionCircleIcon className="ml-1 h-5" /></span>
                </Tooltip>
              </div>
            </Td>
            <Td>
              <Button colorScheme="teal" size="sm" onClick={controller.handleClickCleanUpDustBoxedFiles}>クリーンアップの実行</Button>
            </Td>
          </Tr>

          </Tbody>
        </Table>
      </section>

      <Modal
        onClose={controller.onCloseProgressModal}
        isOpen={controller.isOpenProgressModal}
        isCentered
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <div className="flex flex-col items-center mb-2">
              <div className=" mb-2">{controller.modalSentence}</div>
              <Progress size="xs" className="w-full" isIndeterminate />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* TODO
      フォルダ容量最適化
      テーマカラー */}



    </div>
  )
}