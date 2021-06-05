import React from 'react';
import { IconButton, Button, useToast } from "@chakra-ui/react"
import Link from 'next/link';
import { remote } from "electron";
import { CogIcon, HomeIcon } from '../../components/icons';
import { LeftMenuType } from '../../resources/LeftMenuType';
import useSetupDB from '../../hooks/useSetupDB';
import { useRecoilCallback } from 'recoil';
import { initializeApplicationUsecase } from '../../usecases/initializeApplicationUsecase';
import columnSpacesState from '../../recoils/atoms/columnSpacesState';
import relatedCellsState from '../../recoils/atoms/relatedCellsState';
import displaySettingsState from '../../recoils/atoms/displaySettingsState';
import globalSettingsState from '../../recoils/atoms/globalSettingsState';

type Props = {
  children: React.ReactNode,
  leftMenuType: LeftMenuType,
}

export const BaseLayout = (props: Props) => {

  const [hasLoaded, hasError, setHasLoaded, setHasError] = useSetupDB();
  const toast = useToast();

  const handleClickSetup = useRecoilCallback(({snapshot, set}) => async (event) => {
    try {
      const [newColumnSpaces, newRelatedCells, newDisplaySettings, newGlobalSettings] = await initializeApplicationUsecase();
      set(columnSpacesState, newColumnSpaces);
      set(relatedCellsState, newRelatedCells);
      set(displaySettingsState, newDisplaySettings);
      set(globalSettingsState, newGlobalSettings);
      setHasLoaded(true);
      setHasError(false);
    } catch (e) {
      toast({ title: e.message, status: "error", position: "bottom-right", isClosable: true, duration: 10000,})
    }
  }, []);

  return (

    <div className="flex flex-col h-screen">
      {/* メニューバー */}
      <div className=" bg-gray-900 text-sm flex justify-between" style={{height: "25px"}}>

        {/* メニュー */}
        <div className="flex">
          <div className="hover:bg-gray-700 grid place-items-center w-14 text-gray-300 cursor-default">File</div>
          <div className="hover:bg-gray-700 grid place-items-center w-14 text-gray-300 cursor-default">Help</div>
        </div>

        <div className="webkit-app-region-drag flex-auto"></div>

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
        {hasError &&
          <div className="grid place-items-center w-full">
            <div className="flex items-center">
              <img src="/images/icon-title.png" className=""/>
              <div className="flex flex-col items-center mt-4">
                <Button colorScheme="gray" size="sm" onClick={handleClickSetup}>初期データのセットアップ</Button>
                <div className="mt-3 text-sm">
                  <a href="https://github.com/lainNao/Lace" target="_blank" rel="noopener" className="text-blue-500">README</a>
                </div>
              </div>
            </div>
            {/* <div>既存データが読み込めない等の場合　FAQ</div> */}
          </div>
        }

        {(!hasError && !hasLoaded) &&
          <div className="bg-gray-900">
            {/* TODO 一瞬チラ見するのが気になるからどうするかな */}
          </div>
        }

        {(!hasError && hasLoaded) &&
          <>
            {/* 一番左の部分 */}
            <div className="flex flex-col items-center p-2 space-y-2.5 bg-gray-900">
              <Link href="/home"><IconButton aria-label="search" style={{outline:"none"}} icon={<HomeIcon className={`${props.leftMenuType === LeftMenuType.HOME && "text-blue-400"}`} />} /></Link>
              <Link href="/settings"><IconButton aria-label="edit" style={{outline:"none"}} icon={<CogIcon className={`${props.leftMenuType === LeftMenuType.SETTINGS && "text-blue-400"}`} />}/></Link>
            </div>

            {props.children}
          </>
        }
      </div>

      {/* フッター */}
      <div className="" style={{height: "25px"}}>
        foot（状態表示など）
      </div>

    </div>

  )
}