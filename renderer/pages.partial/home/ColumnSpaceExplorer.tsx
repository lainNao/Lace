import React, { useCallback } from 'react';
import { Button, IconButton } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useColumnSpaceExplorerController } from '../../controllers/home/useColumnSpaceExplorerController';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Select, Input } from "@chakra-ui/react"
import { FileSystemEnum } from '../../resources/enums/app';
import { CellDataType, cellDataTypeIcons, cellDataTypeStrings } from '../../resources/CellDataType'
import { TreeItem } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';
import { ColumnSpaces } from '../../models/ColumnSpaces';
import { CellManagerModal } from './ColumnSpaceExplorer.partial/CellManagerModal';
import { CellRerationModal } from './ColumnSpaceExplorer.partial/CellRelationModal';
import { DisplaySettingModal } from './ColumnSpaceExplorer.partial/DisplaySettingModal';

type Props = {
  classeName?: string;
}

const useStyles = makeStyles({
  label: {
    fontSize: "14px"
  },
});

export type CellManagerModalBodyProps = {
  onClickCreateNewCell: any, //TODO
  handleClickNewCellFormClose: any, //TODO
  onSubmitRelationForm: any, //TODO
  columnSpaceId: string,
  columnId: string,
}

export const ColumnSpaceExplorer: React.FC<Props> = props => {

  const controller = useColumnSpaceExplorerController();
  const classes = useStyles()

  if (!controller.columnSpaces) {
    //TODO ここまともにする
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
                data-name={columnSpace.name}
                data-has-child-column-spaces={!!(columnSpace.hasChildColumnSpace())}
                data-has-columns={!!(columnSpace.hasColumns())}
                onClick={controller.handleClickColumnSpace}
                onDragStart={controller.handleDragStartOnColumnSpace}
                onDragEnter={controller.handleDragEnterOnColumnSpace}
                onDragLeave={controller.handleDragLeaveOnColumnSpace}
                onDragOver={controller.handleDragOverOnColumnSpace}
                onDrop={controller.handleDropOnColumnSpace}
                onContextMenu={controller.handleRightClickOnColumnSpace}
                >{columnSpace.name}</div>
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
                    onKeyDown={controller.hanleKeyDownOnColumn}
                    data-type={FileSystemEnum.Column}
                    data-column-type={column.type}
                    data-id={column.id}
                    data-column-space-id={columnSpace.id}
                    data-name={column.name}
                    tabIndex={0}
                    label={(
                      <div className="flex items-center">
                        {/* アイコン */}
                        <span>{cellDataTypeIcons(column.type, "w-3 h-3 mr-2")}</span>
                        {/* カラム名 */}
                        <span className="font-sans text-blue-400 text-sm" ref={elem => controller.columnNameRefs.current[column.id] = elem}>
                          {column.name}
                        </span>
                        {/* 編集フォーム */}
                        <form
                          className="hidden"
                          data-id={column.id}
                          onSubmit={event => controller.handleSubmitNewColumnName(event, column.id)}
                          ref={elem => controller.newColumnNameInputRefs.current[column.id] = elem}
                          style={{height: "16px"}}
                        >
                          <input name="new-column-name" className="bg-gray-700 text-sm border border-blue-500 outline-none" spellCheck={false}></input>
                        </form>
                      </div>
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
    <>
      <div
        className={`${props.classeName}`}
        onContextMenu={controller.handleRightClickOnEmptySpace}
        onDragEnter={controller.handleDragEnterOnEmptySpace}
        onDragOver={controller.handleDragOverOnEmptySpace}
        onDrop={controller.handleDropOnEmptySpace}
      >

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

      </div>

      {/* カラム新規作成モーダル */}
      {/* TODO これコンポーネントにする */}
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
                {Object.values(CellDataType).map(key => {
                  const cellDataType = CellDataType[key];
                  return <option key={key} value={cellDataType}>{cellDataTypeStrings[cellDataType]}</option>
                })}
              </Select>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={controller.handleClickCreateNewColumn} isDisabled={controller.newColumnFormName.length === 0} colorScheme="blue" mr={3} >作成</Button>
            <Button variant="ghost" onClick={controller.handleClickNewColmnFormClose}>キャンセル</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* セル管理モーダル */}
      {controller.cellmanagerModalData &&
        <CellManagerModal
          isOpen={controller.isNewCellFormOpen}
          onClose={controller.handleNewCellFormClose}
          title={`${controller.cellmanagerModalData.columnName}の${cellDataTypeStrings[controller.cellmanagerModalData.columnType]}データ管理`}
          // 以下ボディ用
          cellManagerModalData={controller.cellmanagerModalData}
          onClickCreateNewCell={controller.handleNewCellFormCreateButtonClick}
          handleClickNewCellFormClose={controller.handleNewCellFormCloseButtonClick}
          handleNewCellFormCloseButtonClick={controller.handleNewCellFormCloseButtonClick}
          handleNewCellFormCreateButtonClick={controller.handleNewCellFormCreateButtonClick}
          // 以下リレーション用
          onSubmitRelationForm={controller.handleSubmitCellRelationForm}
        >
        </CellManagerModal>
      }

      {/* セル関連付けモーダル */}
      {controller.isCellRelationFormOpen &&
        <CellRerationModal
          isOpen={controller.isCellRelationFormOpen}
          onClose={controller.closeCellRelationForm}
          onSubmit={controller.handleSubmitCellRelationForm}
          relatedCells={controller.relatedCells}
        />
      }

      {/* 表示設定モーダル */}
      {controller.displaySettings &&
        <DisplaySettingModal
          isOpen={controller.isDisplaySettingModalOpen}
          onClose={controller.closeDisplaySettingModal}
          displaySettings={controller.displaySettings}
        />
      }

    </>
  )

}

