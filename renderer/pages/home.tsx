import React from 'react';
import { IconButton, Button } from "@chakra-ui/react"
import { remote } from "electron";
import { CogIcon, HomeIcon } from '../components/icons';
import { LeftMenus, LocalStorageKeys } from '../resources/enums/app';
import * as packageJson from "../../package.json"
import { Menu, MenuItem, MenuDivider, MenuHeader } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import HomeBody from '../pages.partial/HomeBody';
import SettingsBody from '../pages.partial/SettingsBody';
import { useHomeController } from '../controllers/useHomeController';

export const Home = () => {
  const controller = useHomeController();

  return (

    <div className="flex flex-col h-screen">
      {/* メニューバー */}
      <div className=" bg-gray-900 text-sm flex justify-between" style={{height: "25px"}}>

        {/* メニュー */}
        <div className="flex">
          {/* <Menu styles={{backgroundColor:"rgb(60 70 86)", color:"aliceblue"}} menuButton={<div className="hover:bg-gray-700 grid place-items-center w-14 text-gray-300 cursor-default select-none">File</div>}>
            <MenuItem styles={{transitionProperty: "none", padding:"0.1rem 1.5rem", hover: {backgroundColor: "gray"}}}>New File</MenuItem>
          </Menu> */}

          <Menu styles={{backgroundColor:"rgb(60 70 86)", color:"aliceblue"}}  menuButton={<div className="hover:bg-gray-700 grid place-items-center w-14 text-gray-300 cursor-default select-none">About</div>}>
            <MenuItem styles={{transitionProperty: "none", padding:"0.1rem 1.5rem", hover: {backgroundColor: "gray"}}}>
              <a href="https://github.com/lainNao/Lace" target="_blank" rel="noopener">
                <img width="30px" className="mr-3 inline" src="/images/icon.png" role="presentation" />GitHub
              </a>
            </MenuItem>
            <MenuDivider />
            <MenuItem styles={{transitionProperty: "none", padding:"0.1rem 1.5rem", hover: {backgroundColor: "gray"}}}>Check for updates</MenuItem>
            <MenuHeader>{`installed version: ${packageJson.version}`}</MenuHeader>
          </Menu>
        </div>

        {/* 中央表示部分 */}
        <div className="webkit-app-region-drag flex-auto text-center">
          {controller.selectedLeftMenu === LeftMenus.HOME &&
            <div>
              <span>Home{controller.currentSelectedColumnSpace?.name && ` - ${controller.currentSelectedColumnSpace?.name}`}</span>
            </div>
          }
          {controller.selectedLeftMenu === LeftMenus.SETTINGS &&
            <div>
              <span>Settings</span>
            </div>
          }
        </div>

        {/* 各種ボタン */}
        <div className="flex">
          <div className="hover:bg-gray-700 grid place-items-center w-14 text-gray-300" onClick={() => remote.getCurrentWindow().minimize()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </div>
          <div className="hover:bg-gray-700 grid place-items-center w-14 text-gray-300" style={{fill:"white"}} onClick={() => {
            const window = remote.getCurrentWindow();
            if (!window.isMaximized()) {
              window.maximize();
            } else {
              window.unmaximize();
            }
          }}>
            <svg height="18px" viewBox="0 -43 512 512" width="18px" xmlns="http://www.w3.org/2000/svg"><path d="m368 341.332031h-224c-32.363281 0-58.667969-26.300781-58.667969-58.664062v-138.667969c0-32.363281 26.304688-58.667969 58.667969-58.667969h224c32.363281 0 58.667969 26.304688 58.667969 58.667969v138.667969c0 32.363281-26.304688 58.664062-58.667969 58.664062zm-224-224c-14.699219 0-26.667969 11.96875-26.667969 26.667969v138.667969c0 14.699219 11.96875 26.664062 26.667969 26.664062h224c14.699219 0 26.667969-11.964843 26.667969-26.664062v-138.667969c0-14.699219-11.96875-26.667969-26.667969-26.667969zm0 0"/><path d="m16 170.667969c-8.832031 0-16-7.167969-16-16v-96c0-32.363281 26.304688-58.667969 58.667969-58.667969h96c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16h-96c-14.699219 0-26.667969 11.96875-26.667969 26.667969v96c0 8.832031-7.167969 16-16 16zm0 0"/><path d="m496 170.667969c-8.832031 0-16-7.167969-16-16v-96c0-14.699219-11.96875-26.667969-26.667969-26.667969h-96c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h96c32.363281 0 58.667969 26.304688 58.667969 58.667969v96c0 8.832031-7.167969 16-16 16zm0 0"/><path d="m453.332031 426.667969h-96c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h96c14.699219 0 26.667969-11.96875 26.667969-26.667969v-96c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v96c0 32.363281-26.304688 58.667969-58.667969 58.667969zm0 0"/><path d="m154.667969 426.667969h-96c-32.363281 0-58.667969-26.304688-58.667969-58.667969v-96c0-8.832031 7.167969-16 16-16s16 7.167969 16 16v96c0 14.699219 11.96875 26.667969 26.667969 26.667969h96c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"/></svg>
          </div>
          <div className="hover:bg-red-600 grid place-items-center w-14 text-gray-300" onClick={() => remote.getCurrentWindow().close()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* ボディ */}
      <div className="flex flex-row w-screen flex-auto overflow-y-hidden" style={{height: "95%"}}>


        {/* DB読み込みエラーがあった場合 */}
        {controller.hasError &&
          <div className="grid place-items-center w-full">
            <div className="flex items-center">
              <img src="/images/icon-title.png" className=""/>
              <div className="flex flex-col items-center mt-4">
                {localStorage.getItem(LocalStorageKeys.HAS_ONCE_INITIALIZED)
                    //過去に初期化したことはあるが、なんらかの原因でDBが読み込めない場合
                    ? <div>
                      <div>データが読み込めませんか？</div>
                      <div>なんらかのエラーが起きている可能性があるのでまずデータのバックアップを取ってください。</div>
                      <div>（データはOSのユーザ用ディレクトリの中の「Lace」ディレクトリか、または過去に変更したディレクトリパスにあります）</div>
                      <div>次にFAQを探して解決してください（後で用意するつもりです…）</div>
                      <div>または無料なので諦め、以下のボタンを押して新しく初期化してください（既存データは消えます）</div>
                      <div className="mt-6 text-center">
                        <Button colorScheme="gray" size="sm" onClick={controller.handleClickSetup}>データの初期化</Button>
                      </div>
                    </div>
                  //過去に初期化したこともなく、読み込めない場合（通常の最初期化）
                  : <Button colorScheme="gray" size="sm" onClick={controller.handleClickSetup}>初期データのセットアップ</Button>
                }
                <div className="mt-3 text-sm">
                  <a href="https://github.com/lainNao/Lace" target="_blank" rel="noopener" className="text-blue-500">README</a>
                </div>
              </div>
            </div>
            {/* <div>既存データが読み込めない等の場合　FAQ</div> */}
          </div>
        }

        {/* エラーが特に無い場合 */}
        {(!controller.hasError && controller.hasLoaded) &&
          <>
            {/* 一番左の部分 */}
            <div className="flex flex-col items-center p-2 space-y-2.5 bg-gray-900">
              <IconButton aria-label="home" style={{outline:"none"}} onClick={() => controller.setSelectedLeftMenu(LeftMenus.HOME)} icon={
                <HomeIcon className={`${controller.selectedLeftMenu === LeftMenus.HOME && "text-blue-400"}`} />
              } />
              <IconButton aria-label="settings" style={{outline:"none"}} onClick={() => controller.setSelectedLeftMenu(LeftMenus.SETTINGS)} icon={
                <CogIcon className={`${controller.selectedLeftMenu === LeftMenus.SETTINGS && "text-blue-400"}`} />
              } />
            </div>

            {controller.selectedLeftMenu === LeftMenus.HOME &&
              <HomeBody />
            }

            {controller.selectedLeftMenu === LeftMenus.SETTINGS &&
              <SettingsBody />
            }

          </>
        }
      </div>

      {/* フッター */}
      <div className="flex justify-center items-center bg-gray-900 select-none" style={{height: "25px"}}>
        <img src="/images/icon.png" className="w-5 h-5" /><span className="ml-2 font-serif text-sm text-gray-300">Lace</span>
      </div>

    </div>

  )
}

export default Home;
