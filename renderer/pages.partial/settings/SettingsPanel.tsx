import { useSettingsPanelController } from "../../controllers/settings/useSettingsPanelController";
import { Button } from "@chakra-ui/react"
import { Progress, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption } from "@chakra-ui/react"
import { GlobalSettingKeys } from "../../models/GlobalSettings/GlobalSettings";

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
              <Th>設定値</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>DBファイル保存先ディレクトリ</Td>
              <Td>
                {controller.saveDirPath}
                <Button className="ml-3" colorScheme="teal" size="sm" onClick={controller.handleClickCustomSaveDirPath}>変更</Button>
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