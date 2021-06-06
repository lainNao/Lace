import { useColumnSpaceDisplayerController } from "../../controllers/home/useColumnSpaceDisplayerController";
import { Tag, TagLabel, TagLeftIcon, TagRightIcon, TagCloseButton } from "@chakra-ui/react"
import { ExclamationCircleIcon } from "../../components/icons/ExclamationCircleIcon";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import { FilterPane, MainPane, SubPane } from "./ColumnSpaceDisplayer.partial";

type Props = {
  className: string;
}

export const ColumnSpaceDisplayer = (props: Props) => {

  const controller = useColumnSpaceDisplayerController();

  // まだ初期化されてない時
  if (!controller.hasInitialized) {
    //TODO ここどうにかする
    return (
      <div>読込中</div>
    )
  }

  // 表示対象のカラムスペースを未選択の場合、選択を促す
  if (!controller.selectedColumnSpaceId) {
    return (
      <div className="flex flex-col items-center h-full justify-center">
        <Tag size="lg" colorScheme="teal" className="py-2" style={{lineHeight: "inherit"}}>
          <TagLeftIcon>
            <ExclamationCircleIcon className="h-7 w-7" />
          </TagLeftIcon>
          表示対象のカラムスペースを作成、選択してください
        </Tag>
        <div className="mt-10 px-10">
          <div className="text-center text-sm ">
            <Tag size="md" colorScheme="teal">
              <TagLabel>流れ</TagLabel>
            </Tag>
          </div>
          <ol className="list-decimal mt-3 text-xs">
            <li>カラムスペースを未作成の場合、新規でカラムスペースを作成（左ペインで無の場所を右クリックし「新規カラムスペース」から入力、エンター）</li>
            <li className="mt-3">カラムを未作成の場合、新規でカラムを作成（作成したカラムスペースを右クリックし「追加」「カラム」とクリックし、画面に入力）</li>
            <li className="mt-3">作成したカラムスペースを右クリックし「表示対象に設定」をクリック</li>
          </ol>
        </div>
      </div>
    )
  }

  // 対象カラムスペースの表示設定が空な無い場合、作成を促す
  if (!controller.displaySettings.children[controller.selectedColumnSpaceId]?.length) {
    return (
      <div className="flex flex-col items-center h-full justify-center">
        <Tag size="lg" colorScheme="teal" className="py-2" style={{lineHeight: "inherit"}}>
          <TagLeftIcon>
            <ExclamationCircleIcon className="h-7 w-7" />
          </TagLeftIcon>
          対象カラムスペースの表示形式がありません
        </Tag>
        <div className="mt-10 px-10">
          <div className="text-center text-sm ">
            <Tag size="md" colorScheme="teal">
              <TagLabel>作成の流れ</TagLabel>
            </Tag>
          </div>
          <ol className="list-decimal mt-3 text-xs">
            <li>対象カラムスペースに、カラムを2つ以上作成</li>
            <li className="mt-3">対象カラムスペースを右クリックし「表示形式の管理」を選択</li>
            <li className="mt-3">開いたモーダルウィンドウで表示設定を入力し、追加</li>
          </ol>
        </div>
      </div>
    )
  }

  /*
    controller.selectedColumnSpaceId    //選択中カラムスペースID
    controller.tabIndex                 //選択中の表示設定インデックス
    controller.displaySettings.children[controller.selectedColumnSpaceId][controller.tabIndex]  //表示対象のDisplaySettingモデル
  */

  return (
    <div className={`${props.className}`}>
      <Tabs index={controller.tabIndex} onChange={controller.handleDisplaySettingChange}>

        {/* タブ */}
        <TabList>
          {controller.displaySettings.children[controller.selectedColumnSpaceId].map(displaySetting => {
            return <Tab key={displaySetting.id} style={{outline:"none"}}>{displaySetting.name}</Tab>
          })}
        </TabList>

        {/* タブボディ */}
        <TabPanels>
          {/* TODO 表示設定の配列を回し、mapでTabPanelをレンダリング */}
          {controller.displaySettings.children[controller.selectedColumnSpaceId].map(displaySetting => {
            return (
              <TabPanel>
                <div className="w-full flex">
                  <FilterPane className="w-1/5 overflow-y-auto mr-2" displaySetting={displaySetting} onFilterUpdate={controller.handleFilterUpdate} />
                  <MainPane className="w-2/5 overflow-y-auto mr-2" displaySetting={displaySetting} onMouseMainCell={controller.handleOnMouseMainCell} />
                  <SubPane className="w-2/5 overflow-y-auto ml-2" displaySetting={displaySetting} targetCellId={controller.targetCellId} />
                </div>
              </TabPanel>
            )
          })}
        </TabPanels>
      </Tabs>
    </div>
  )
}
