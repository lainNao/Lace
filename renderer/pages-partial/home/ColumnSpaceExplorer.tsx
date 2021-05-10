import React, { useCallback } from 'react';
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
import { ColumnDataType, FileSystemEnum } from '../../enums/app';
import { TreeItem } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';
import { ColumnSpaces } from '../../models/ColumnSpaces';

type Props = {
  classeName?: string;
}

const useStyles = makeStyles({
  label: {
    fontSize: "15px"
  },
});

export const ColumnSpaceExplorer: React.FC<Props> = props => {

  const controller = useColumnSpaceExplorerController();
  const classes = useStyles()

  // const currentMainDisplayedColumnUUID = "C23456789-C234-C234-C234-C23456789123"  //仮のモック
  // const currentColumnSpaceUUID = "123456789-1234-1234-1234-123456789123"; //仮のモック（これ今は半無限の深さになったので、道筋のUUIDの配列にするのがいいかも）
  // const currentMainColumnDatas = columnSpaces[props.currentColumnSpaceId].columns[props.currentMainColumnId].datas;

  if (!controller.columnSpaces) {
    return (
      <div>読込中</div>
    )
  }

  const generateColumnSpaceElementTree = useCallback((columnSpaces: ColumnSpaces) => {

    return columnSpaces.mapChildren((columnSpace) => {
      return (
        <React.Fragment key={columnSpace.id} >
          <TreeItem
            nodeId={columnSpace.id}
            label={
              <div
                draggable
                data-type={FileSystemEnum.ColumnSpace}
                data-id={columnSpace.id}
                data-name={`${columnSpace.name}`}
                data-has-child-column-spaces={!!(columnSpace.hasChildColumnSpace())}
                data-has-columns={!!(columnSpace.hasColumns())}
                onDragStart={controller.handleDragStartOnColumnSpace}
                onDragEnter={controller.handleDragEnterOnColumnSpace}
                onDragLeave={controller.handleDragLeaveOnColumnSpace}
                onDragOver={controller.handleDragOverOnColumnSpace}
                onDrop={controller.handleDropOnColumnSpace}
                onContextMenu={controller.handleRightClickOnColumnSpace}
                >{`${columnSpace.name}`}</div>
            }
            classes={{
              label: classes.label,
            }}
            TransitionProps={{
              "timeout": 0
            }}
          >
            {columnSpace.hasChildColumnSpace()
              // カラムスペースを再帰レンダリング
              ? generateColumnSpaceElementTree(columnSpace.childColumnSpaces)
              // 末端（カラム）をレンダリング
              : columnSpace.columns.mapChildren((column) =>
                  <TreeItem
                    draggable
                    key={column.id}
                    nodeId={column.id}
                    onClick={controller.handleClickColumn}
                    onDragStart={controller.handleDragStartOnColumn}     //NOTE: なぜかこれがここでしか発火しないのでこっちに移動
                    onDragEnter={e => controller.handleDragEnterOnColumn(e)}
                    onDragLeave={e => controller.handleDragLeaveOnColumn(e)}
                    onDragOver={controller.handleDragOverOnColumn}
                    onDrop={controller.handleDropOnColumn}
                    onContextMenu={controller.handleRightClickOnColumn}
                    data-type={FileSystemEnum.Column}
                    data-id={column.id}
                    data-column-space-id={columnSpace.id}
                    data-name={`${column.name}`}
                    label={(
                      <div className="font-sans text-blue-400 text-sm">{`${column.name}`}</div>
                    )}
                  />
                )
            }
          </TreeItem>
          <form
            className="ml-9 hidden"
            data-id={columnSpace.id}
            onSubmit={event => {controller.handleSubmitNewColumnSpaceForm(event, columnSpace.id)}}
            ref={elem => controller.newColumnSpacesFormRefs.current[columnSpace.id] = elem}
          >
            <input name="new-column-space-name" className="bg-gray-700" spellCheck={false}></input>
          </form>
        </React.Fragment>
      )
    })
  }, []);

  return (
    <div className={`${props.classeName}`} onContextMenu={controller.handleRightClickOnEmptySpace}>

      {/* TODO エクスプローラーの一番上の部分 */}
      <div>
        <span>カラムスペース</span>
        <IconButton className="ml-3" aria-label="add" icon={<AddIcon />} onClick={controller.handleClickAddColumnSpaceButton}/>
      </div>

      {/* ツリービュー */}
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        className="select-none"
        expanded={controller.expandedColumnSpaces}
        selected={controller.selectedNodeId}
        onNodeToggle={controller.handleTreeNodeToggle}
      >
        {generateColumnSpaceElementTree(controller.columnSpaces)}
      </TreeView>

      {/* トップレベルのカラムスペース追加フォーム */}
      <form onSubmit={controller.handleSubmitTopLevelNewColumnSpaceForm} className="hidden ml-5" ref={controller.newTopLevelColumnSpaceFormRef} >
        <input name="new-column-space-name" className="bg-gray-700" spellCheck={false}></input>
      </form>

      {/* カラム新規作成モーダル */}
      <Modal isOpen={controller.isNewColumnFormOpen} onClose={controller.closeNewColumnForm}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>カラムの新規作成</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form ref={controller.newColumnFormRef} onSubmit={(e) => e.preventDefault()} className="mb-3">
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
            <Button onClick={controller.handleClickCreateNewColumn} isDisabled={controller.newColumnFormName.length === 0} colorScheme="blue" mr={3} >作成</Button>
            <Button variant="ghost" onClick={controller.handleClickNewColmnFormClose}>キャンセル</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  )

}

