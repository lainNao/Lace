import React from "react";
import { Footer } from "./Footer";
import { MenuBar } from "./Menubar";
import { Tag } from "@chakra-ui/react"
import { InfoOutlineIcon } from '@chakra-ui/icons'

type Props = {
  error: Error;
}

export const ErrorFallback = (props: Props) => {
  console.debug("エラーフォールバックを描画", props.error)

  return (
    <div className="flex flex-col h-screen">

      {/* メニューバー */}
      <div className=" bg-gray-900 text-sm flex justify-between" style={{height: "25px"}}>
        <MenuBar />
      </div>

      {/* ボディ */}
      <div className="flex flex-col items-center justify-center text-sm w-screen flex-auto overflow-y-hidden" style={{height: "95%"}}>
        <InfoOutlineIcon w={6} h={6} color="red.200" className="mb-5"/>
        <div>申し訳ないです。なんらかのエラーが起きたのでエラーダウンダリーを表示しています。</div>
        <div>エラー内容は以下です。よければ作者かメニューバーから辿れるgithubのissueページかどこかに以下のエラー情報のスクショを連絡して解決を待つか、または諦めてください。</div>
        <div>解決されるまでデータはいじらないでください。</div>
        <div className="mt-3 flex flex-col items-center">

          {/* name */}
          <div className="mt-5 mb-2"><Tag size="md" variant="outline" colorScheme="blue">error name</Tag></div>
          <div>{props.error?.name}</div>

          {/* message */}
          <div className="mt-5 mb-2"><Tag size="md" variant="outline" colorScheme="blue">error message</Tag></div>
          <div>{props.error?.message}</div>

          {/* stack */}
          <div className="mt-5 mb-2"><Tag size="md" variant="outline" colorScheme="blue">error stack</Tag></div>
          <pre className="text-gray-400">{props.error?.stack}</pre>

        </div>
      </div>

      {/* フッター */}
      <div className="flex justify-center items-center bg-gray-900 select-none" style={{height: "25px"}}>
        <Footer />
      </div>

  </div>
)
}