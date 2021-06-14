import React from "react";
import * as packageJson from "../../package.json"
import { Menu, MenuItem, MenuDivider, MenuHeader } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { useMenuBarController } from "../controllers/useMenuBarController";
import { LeftMenus } from "../resources/enums/app";
import { remote } from "electron";

export const MenuBar = () => {

  const controller = useMenuBarController();

  return (
    <>
      {/* 各種メニュー */}
      <div className="flex">

        {/* About */}
        <Menu styles={{backgroundColor:"rgb(60 70 86)", color:"aliceblue"}}  menuButton={<div className="hover:bg-gray-700 grid place-items-center w-14 text-gray-300 cursor-default select-none">About</div>}>
          <MenuItem styles={{transitionProperty: "none", padding:"0.1rem 1.5rem", hover: {backgroundColor: "gray"}}}>
            <a href="https://github.com/lainNao/Lace" target="_blank" rel="noopener">
              <img width="30px" className="mr-3 inline" src="/images/icon.png" role="presentation" />GitHub
            </a>
          </MenuItem>
          <MenuDivider />
          {/* <MenuItem styles={{transitionProperty: "none", padding:"0.1rem 1.5rem", hover: {backgroundColor: "gray"}}}>Check for updates</MenuItem> */}
          <MenuHeader>{`installed version: ${packageJson.version}`}</MenuHeader>
        </Menu>

        {/* DEV */}
        {process.env.NODE_ENV !== "production" && (
          <Menu styles={{backgroundColor:"rgb(60 70 86)", color:"aliceblue"}}  menuButton={<div className="hover:bg-gray-700 grid place-items-center w-14 text-gray-300 cursor-default select-none">DEV</div>}>
            <MenuItem styles={{transitionProperty: "none", padding:"0.1rem 1.5rem", hover: {backgroundColor: "gray"}}} onClick={controller.devTestFunction}>
              devTestFunction
            </MenuItem>
          </Menu>
        )}

      </div>

      {/* 中央表示部分 */}
      <div className="webkit-app-region-drag flex-auto text-center">
        {controller.selectedLeftMenu === LeftMenus.HOME &&
          <div>
            <span>Home{controller.displayTargetSelectedColumnSpace?.name && ` - ${controller.displayTargetSelectedColumnSpace.name}`}</span>
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

    </>
  )
}
