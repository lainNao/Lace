import React from 'react';
import { IconButton, Button } from "@chakra-ui/react"
import { CogIcon, HomeIcon } from '../components/icons';
import { LeftMenus, LocalStorageKeys } from '../resources/enums/app';
import '@szhsin/react-menu/dist/index.css';
import HomeBody from '../pages.partial/HomeBody';
import SettingsBody from '../pages.partial/SettingsBody';
import { useHomeController } from '../controllers/useHomeController';
import { AppMenuBar } from '../components/AppMenuBar';
import { AppFooter } from '../components/AppFooter';

export const Home = () => {
  const controller = useHomeController();

  return (

    <div className="flex flex-col h-screen">

      {/* メニューバー */}
      <div className=" bg-gray-900 text-sm flex justify-between" style={{height: "25px"}}>
        <AppMenuBar />
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
                  ? (
                      <div>
                        <div>データが読み込めませんか？</div>
                        <div>なんらかのエラーが起きている可能性があるのでまずデータのバックアップを取ってください。</div>
                        <div>（データはOSのユーザ用ディレクトリの中の「Lace」ディレクトリか、または過去に変更したディレクトリパスにあります）</div>
                        <div>次にFAQを探して解決してください（後で用意するつもりです…）</div>
                        <div>または無料なので諦め、以下のボタンを押して新しく初期化してください（既存データは消えます）</div>
                        <div className="mt-6 text-center">
                          <Button colorScheme="gray" size="sm" onClick={controller.handleClickSetup}>データの初期化</Button>
                        </div>
                      </div>
                    )
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
            {/* 左メニュー */}
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
        <AppFooter />
      </div>

    </div>

  )
}

export default Home;
