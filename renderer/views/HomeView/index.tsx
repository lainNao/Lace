import React from 'react';
import { IconButton } from "@chakra-ui/react"
import { SearchIcon, EditIcon } from "@chakra-ui/icons"
import { columnSpacesType, columnSpaceType } from '../../@types/app';

interface HomeViewProps {
  columnSpaceDB: columnSpacesType,
  currentColumnSpaceId: string,
  currentMainColumnId: string,
}

export const HomeView: React.FC<HomeViewProps> = (props) => {
  if (props.columnSpaceDB == null) {
    return (
      <div>DB読込中</div>
    )
  }

  const currentMainColumnDatas = props.columnSpaceDB[props.currentColumnSpaceId].columns[props.currentMainColumnId].datas;

  return (
    <div className="flex flex-col h-screen">
      <div className="header">
        head（自由検索、各種設定、ヘルプ、リンクなど）
      </div>
      <div className="content flex flex-row w-screen max-h-full ">

        <div className="flex flex-col items-center overflow-y-auto p-1 w-120px space-y-2.5">
          <IconButton aria-label="search" icon={<SearchIcon />} />
          <IconButton aria-label="edit" icon={<EditIcon />} />
        </div>

        <div className="min-w-300px overflow-y-auto p-3">
          カラムスペースの選択
          {Object.keys(props.columnSpaceDB).map((columnSpaceUUID, index) => {
            const columnSpace: columnSpaceType = props.columnSpaceDB[columnSpaceUUID];
            return (
              <div key={index}>
                {columnSpace.name}
              </div>
            )
          })}
        </div>

        <div className=" overflow-y-auto p-3">
          {Object.keys(currentMainColumnDatas).map((dataUUID,index) => {
            const data = currentMainColumnDatas[dataUUID];
            return (
              <div key={`${data.name}-${index}`}>
                <div><img src={data.path} /></div>
                <div>{data.name}</div>
              </div>
            )
          })}
        </div>

        <div className=" min-w-300px overflow-y-auto p-3">
          セルの詳細の表示
        </div>

      </div>

      <div className="footer">
        foot（状態表示など）
      </div>

    </div>
  )

}
