import React, {ReactElement} from 'react';
import { IconButton } from "@chakra-ui/react"
import { SearchIcon, EditIcon, AddIcon } from "@chakra-ui/icons"
import { columnSpacesType, columnSpaceType, columnType } from '../../@types/app';
import { useForceUpdate } from '../../hooks/useForceUpdate'
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import { makeStyles, withStyles } from '@material-ui/core/styles';


interface HomeViewProps {
  columnSpaceDB: columnSpacesType,
  currentColumnSpaceId: string,
  currentMainColumnId: string,
  service: any,
}

const initialState = {
  targetType: null,
  mouseX: null,
  mouseY: null,
};

enum ContextMenuTargetType {
  EmptySpace,
  Directory,
  Column,
  Data,
}

enum DirectoryDraggingState {
  Releasing,
  Downed,
  Dragging,
}

interface onContextMenuMeta {
  targetType: ContextMenuTargetType,
}

interface targetElementDatasets {
  type: string,
  name: string,
  uuid: string,
}


const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "gray",
    textColor: "white",
    outline: "none",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


export const HomeView: React.FC<HomeViewProps> = (props) => {
  const forceUpdate = useForceUpdate();
  const classes = useStyles();

  const [contextMenuState, setContextMenuState] = React.useState(initialState);
  const [directoryDraggingState, setDirectoryDraggingState] = React.useState(DirectoryDraggingState.Releasing);
  const [draggingTargetInfo, setDraggingTargetInfo] = React.useState<targetElementDatasets>(null);

  /// 以下ツリー右クリック関連の処理
  /// コンテキストメニューの処理をいろいろ実装すること
  const handleRightClickOnTree = (event: React.MouseEvent<HTMLElement, MouseEvent>, meta: onContextMenuMeta) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenuState({
      targetType: meta.targetType,
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const [open, setOpen] = React.useState(false);
  const [modalContent, setModalContent] = React.useState<ReactElement<any, any>>();

  const handleOpenModal = (modalContent: ReactElement<any,any>) => {
    setOpen(true);
    setModalContent(modalContent)
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleCloseContextMenu = () => {
    setContextMenuState(initialState);
  };


  /// 以下ディレクトリを別ディレクトリにドロップする関連の処理
  /// ドロップしている要素の名前をマウスの右下に出すこと、別ディレクトリにドロップ中にされてる側の背景色が変わること（できれば）、ドロップした後に確認モーダルで決定したら移動されること
  /// ディレクトリをドロップで移動したらファイルも移動になるのでどうしよう。UUIDのみのフォルダに統一できるなら移動する必要ないけどその場合は親子関係をなんらかの値で表現して読み取る必要ある。
  /// そもそもディレクトリ構造にカラムスペースのフォルダは不要なのでは。カラムのみでいい。それならいくらでも移動できる。多分この考えでいける。となるとディレクトリ構造変えるのも対応する必要あり。まずリポジトリ内のソース変更してそこ対応してしまおう、その後にいろいろやろう。でも親子構造をどうデータに反映するかな。
  const handleMouseDownOnDirectory = (event) => {

    const onMouseUpFromDirectoryDragging = (innerEvent) => {
      const droppedElementDataset = innerEvent.toElement.parentElement.parentElement.dataset;
      const dropElementDatase = event.target.parentElement.parentElement.dataset;

      const areBothDirectory: boolean = (droppedElementDataset.type == ContextMenuTargetType.Directory.valueOf())
      const areBothDifferent: boolean = (droppedElementDataset.uuid !== dropElementDatase.uuid)
      const isDroppedHasNoColumnsOrChildColumnSpaces = (droppedElementDataset.hasChildColumnSpaces === "false" && droppedElementDataset.hasColumns === "false")
      if (areBothDirectory && areBothDifferent && isDroppedHasNoColumnsOrChildColumnSpaces) {
        console.log("ディレクトリを（columnsもchildColumnSpacesも無い）別ディレクトリにドロップした")
        console.log("された", droppedElementDataset)      //ドロップされた側
        console.log("した側", dropElementDatase)          //ドロップしたがわ
        handleOpenModal(
          <div>
            <h3 className="font-semibold mb-3 text-center">どうしますか？</h3>
            <div className="flex justify-around">
              <Button variant="contained" color="primary"onClick={() => {
                // service.MoveDir(fromUUID, toUUID)
                handleCloseModal();
              }}>はい</Button>
              <Button variant="contained" onClick={handleCloseModal}>いいえ</Button>
            </div>
          </div>
        )
      }

      document.removeEventListener("mouseup", onMouseUpFromDirectoryDragging)
      setDirectoryDraggingState(DirectoryDraggingState.Releasing)
      setDraggingTargetInfo(null)
    }

    document.addEventListener("mouseup", onMouseUpFromDirectoryDragging)
    setDirectoryDraggingState(DirectoryDraggingState.Downed)
    setDraggingTargetInfo(event.target.parentElement.parentElement.dataset)
  }

  const handleDragStartOnDirectory = (event) => {
    if (directoryDraggingState === DirectoryDraggingState.Downed) {
      setDirectoryDraggingState(DirectoryDraggingState.Dragging)
    }
  }

  const handleDragOverOnDirectory = (event) => {
    if (directoryDraggingState === DirectoryDraggingState.Dragging) {
      console.log("onmouseover")
      console.log(draggingTargetInfo)
    }
  }


  if (props.columnSpaceDB == null) {
    return (
      <div>DB読込中</div>
    )
  }

  const generateColumnSpaceElementTree = (columnSpace, selfColumnSpaceUUID) => {
    const hasChildColumnSpaces = !!(Object.keys(columnSpace.childColumnSpaces)?.length)

    return (
      <TreeItem
        key={selfColumnSpaceUUID}
        nodeId={selfColumnSpaceUUID}
        label={columnSpace.name}
        onMouseDown={handleMouseDownOnDirectory}
        onMouseMove={handleDragStartOnDirectory}
        onMouseOver={handleDragOverOnDirectory}
        onContextMenu={(event) => handleRightClickOnTree(event, {targetType: ContextMenuTargetType.Directory})}
        data-type={ContextMenuTargetType.Directory}
        data-name={columnSpace.name}
        data-uuid={selfColumnSpaceUUID}
        data-has-child-column-spaces={hasChildColumnSpaces}
        data-has-columns={!!(Object.keys(columnSpace.columns)?.length)}
      >
        {hasChildColumnSpaces
          // カラムスペースを再帰レンダリング
          ? Object.keys(columnSpace.childColumnSpaces).map((childColumnSpaceUUID, secondaryIndex) => {
              const childColumnSpace: columnSpaceType = columnSpace.childColumnSpaces[childColumnSpaceUUID];
              return generateColumnSpaceElementTree(childColumnSpace, childColumnSpaceUUID);
            })
          // カラムをレンダリング
          : Object.keys(columnSpace.columns).map((columnUUID, columnIndex) => {
              const column: columnType = columnSpace.columns[columnUUID];
              return (
                <TreeItem
                  key={columnUUID}
                  nodeId={columnUUID}
                  label={column.name}
                  onContextMenu={(event) => handleRightClickOnTree(event, {targetType: ContextMenuTargetType.Column})}
                />
              )
            })
        }
      </TreeItem>
    )
  }

  // const currentMainColumnDatas = props.columnSpaceDB[props.currentColumnSpaceId].columns[props.currentMainColumnId].datas;

  return (
    <div className="flex flex-col h-screen">
      <div className="header">
        head（自由検索、各種設定、ヘルプ、リンクなど）
      </div>
      <div className="content flex flex-row w-screen max-h-full ">

        <div className="flex flex-col items-center overflow-y-auto p-3 space-y-2.5">
          <IconButton aria-label="search" icon={<SearchIcon />} />
          <IconButton aria-label="edit" icon={<EditIcon />} />
        </div>

        <div className="min-w-300px overflow-y-auto p-3" onContextMenu={(event) => handleRightClickOnTree(event, {targetType: ContextMenuTargetType.EmptySpace})}>
          <div>
            <span >カラムスペース</span>
            <IconButton className="ml-3" aria-label="add" icon={<AddIcon />} onClick={ async() => {
              await props.service.addColumnSpace("aaa")
              forceUpdate();
            }}/>
          </div>
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            className="select-none"
            >
            {Object.keys(props.columnSpaceDB).map((columnSpaceUUID) => {
              return generateColumnSpaceElementTree(props.columnSpaceDB[columnSpaceUUID], columnSpaceUUID)
            })}
          </TreeView>
        </div>

        <div className="min-w-300px overflow-y-auto p-3">
        <Modal
          open={open}
          onClose={handleCloseModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className={classes.paper}>
            {modalContent}
          </div>
        </Modal>

          {/* {Object.keys(currentMainColumnDatas).map((dataUUID,index) => {
            const data = currentMainColumnDatas[dataUUID];
            return (
              <div key={`${data.name}-${index}`}>
                <div><img src={data.path} /></div>
                <div>{data.name}</div>
              </div>
            )
          })} */}
        </div>

        <div className=" min-w-300px overflow-y-auto p-3">
          セルの詳細の表示
        </div>

      </div>

      <div className="footer">
        foot（状態表示など）
      </div>

      <Menu
        keepMounted
        open={contextMenuState.mouseY !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenuState.mouseY !== null && contextMenuState.mouseX !== null
            ? { top: contextMenuState.mouseY, left: contextMenuState.mouseX }
            : undefined
        }
      >
        {contextMenuState.targetType === ContextMenuTargetType.EmptySpace &&
          [
            <MenuItem onClick={handleCloseContextMenu}>なにもないところを右クリ</MenuItem>
          ]
        }
        {contextMenuState.targetType === ContextMenuTargetType.Directory &&
          [
            <MenuItem key="表示" onClick={handleCloseContextMenu}>表示</MenuItem>,
            <MenuItem key="フォルダ追加" onClick={handleCloseContextMenu}>フォルダ追加</MenuItem>,
            <MenuItem key="削除" onClick={handleCloseContextMenu}>削除</MenuItem>,
            <MenuItem key="リネーム" onClick={handleCloseContextMenu}>リネーム</MenuItem>,
          ]
        }
        {contextMenuState.targetType === ContextMenuTargetType.Column &&
          [
            <MenuItem onClick={handleCloseContextMenu}>あああ</MenuItem>
          ]
        }
      </Menu>



    </div>
  )

}

