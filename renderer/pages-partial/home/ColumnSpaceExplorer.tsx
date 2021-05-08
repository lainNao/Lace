import React from 'react';
import { Button, IconButton } from "@chakra-ui/react"
import { SearchIcon, EditIcon, AddIcon } from "@chakra-ui/icons"
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useColumnSpaceExplorerController } from '../../controllers/home/useColumnSpaceExplorerController';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Input,
} from "@chakra-ui/react"
import { ColumnDataType } from '../../enums/app';

type Props = {
  classeName?: string;
}

export const ColumnSpaceExplorer: React.FC<Props> = props => {

  const controller = useColumnSpaceExplorerController();
  // const currentMainDisplayedColumnUUID = "C23456789-C234-C234-C234-C23456789123"  //仮のモック
  // const currentColumnSpaceUUID = "123456789-1234-1234-1234-123456789123"; //仮のモック（これ今は半無限の深さになったので、道筋のUUIDの配列にするのがいいかも）
  // const currentMainColumnDatas = columnSpaces[props.currentColumnSpaceId].columns[props.currentMainColumnId].datas;

  if (!controller.columnSpaces) {
    return (
      <div>読込中</div>
    )
  }

  return (
    <div className={`${props.classeName}`} onContextMenu={controller.handleRightClickOnEmptySpace}>

      <div>
        <span>カラムスペース</span>
        <IconButton className="ml-3" aria-label="add" icon={<AddIcon />} onClick={controller.handleClickAddColumnSpaceButton}/>
      </div>

      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        className="select-none"
        expanded={controller.expandedColumnSpaces}
        selected={controller.selectedNodeId}
        onNodeToggle={controller.handleTreeNodeToggle}
      >
        {controller.generateColumnSpaceElementTree(controller.columnSpaces)}
      </TreeView>

      <form onSubmit={controller.handleSubmitTopLevelNewColumnSpaceForm} className="hidden ml-5" ref={controller.newTopLevelColumnSpaceFormRef} >
        <input name="new-column-space-name" className="bg-gray-700" spellCheck={false}></input>
      </form>

      <Modal isOpen={controller.isNewColumnFormOpen} onClose={controller.closeNewColumnForm}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>カラムの新規作成</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form ref={controller.newColumnFormRef} className="mb-3">
              <div>カラム名</div>
              <Input name="column-name" onChange={controller.handleChangeNewColumnNameInput} />

              <div className="mt-4">格納するデータタイプ</div>
              <Select name="column-type" >
                {Object.values(ColumnDataType)
                  .filter(key => isNaN(Number(key)))
                  .map(key => {
                    return (
                      <option key={key} value={ColumnDataType[key]}>{key}</option>
                    )
                  })
                }
              </Select>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button onClick={controller.handleSubmitNewColmnForm} isDisabled={controller.newColumnFormName.length === 0} colorScheme="blue" mr={3} >作成</Button>
            <Button variant="ghost" onClick={controller.handleClickNewColmnFormClose}>キャンセル</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  )

}

