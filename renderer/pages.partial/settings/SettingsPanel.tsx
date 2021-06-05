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
            {/* <Tr>
              <Td>
                <div className="flex">
                  <div>DB容量最適化</div>
                  <Tooltip label="現状カラムスペースやカラムやセルを消してもその時はその配下のメディアファイルは削除しないような実装になっちゃっている（トランザクションが面倒なためな）んですが、このオプションではそのもう使われなくなった迷子ファイルを物理削除してくます。バグが無ければ安全です。" aria-label="A tooltip">
                    <span><QuestionCircleIcon className="ml-1 h-5" /></span>
                  </Tooltip>
                </div>
              </Td>
              <Td>
                <Button className="ml-3" colorScheme="teal" size="sm" onClick={controller.handleClickOptimizeDbSize}>実行</Button>
              </Td>
            </Tr> */}
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
          <ModalHeader>DBのコピー中（元ファイルは一応残しますので不要なら自分で消してください）</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Progress size="xs" isIndeterminate />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* TODO
      フォルダ容量最適化
      テーマカラー */}



    </div>
  )
}