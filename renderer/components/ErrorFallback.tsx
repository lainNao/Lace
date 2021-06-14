import React from "react";
import { AppFooter } from "./AppFooter";
import { AppMenuBar } from "./AppMenuBar";
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
        <AppMenuBar />
      </div>

      {/* ボディ */}
      <div className="flex flex-col items-center text-sm w-screen overflow-x-hidden flex-auto px-20" style={{height: "95%"}}>
        <div className="mt-10"><InfoOutlineIcon w={6} h={6} color="red.200" className="mb-5"/></div>
        <div>申し訳ないです。なんらかのエラーが起きたのでエラー画面を一時的に表示しています</div>

        <div className="mt-2 text-blue-400">Q「エラーを解決したい場合どうしたらいいか」</div>
        <div className="text-xs">A：以下の選択肢を1から順に取ってほしいと思います。分かりづらい説明すみません</div>
        <div className="mt-1 text-gray-400 text-xs">
          <div className="mb-1">1, メニューバーの「About」を開いた時に表示されるバージョン番号が最新かどうか<a className="cursor-pointer text-blue-500"  target="_blank" rel="noopener" href="https://github.com/lainNao/Lace/releases">githubのリリースページ</a>にアクセスして見比べてください。違った場合、今のバージョンはアンインストールせずにそのまま最新版をDLしてインストールしてみてください。直る可能性があります。</div>
          <div className="mb-1">2, あと一応、データフォルダをまるごとそのままコピーしてバックアップ取っておいてください。データフォルダの場所は、Windowsならdocuments配下にあると思います。</div>
          <div className="mb-1">3, 最新版だった場合、この画面下部の背景が青い部分のスクショを作者か<a className="cursor-pointer text-blue-500" target="_blank" rel="noopener"  href="https://github.com/lainNao/Lace/issues">issueページ</a>にどうにか伝えて修正を待ち、修正しましたすみませんと連絡が来たら、今のバージョンはアンインストールしないで（言葉の意味通り、しないで）、ただただそのまま修正版をDLしインストールしてください。</div>
          <div className="mb-1">4, 3で直る見込みが無さそうな場合、諦めるか、作者に感情をぶつけるか、法的に手段は無いか考えるか、同じツールを自分で作るか、同じツールをもっと技術力のあるベンダーに作らせてみる等してください。</div>
        </div>

        <div className="mt-2 text-blue-400">Q「データが壊れたのかどうか」</div>
        <div className="text-xs">A：その可能性もありますが、そうじゃない可能性も普通にあります。例えば単なる見た目を表示するUIのプログラムミスの可能性が普通にあります</div>

        <div className="mt-2 text-blue-400">Q「何が起きたのか」</div>
        <div className="text-xs">A：正確なところは以下のエラー情報にありますが、可能性としては「単にUIのコーディングをミスってるだけの可能性」と「データをいじるプログラムに致命的なバグを入れてしまった可能性」があります。前者は解決可能、後者の場合は解決不可な可能性があります</div>

        <div className="mt-2 text-blue-400">Q「このままアプリケーションを閉じて大丈夫か」</div>
        <div className="text-xs">A：現状、閉じるだけなら大丈夫です。できればその前にこの画面下部の青い部分のスクリーンショットを取って、↑の1番から試してほしいなと希望としては思います（もうこの画面出ないかもなので。なおかつこの画面を再度発生させようとするのはデータが終わる可能性があるので）</div>

        <div className="mt-2 text-blue-400">Q「解決までの間、逆にやらないようにしておいたほうがいいことは何か」</div>
        <div className="mt-1 text-xs">
          <div className="mb-1">A：まず、アプリケーションを閉じるのは現状問題無いはずです。ですが、再度開いてデータの追加/編集/削除などの状態を変える系の動作をすると助かる可能性が減るのでしないほうがいいと思います</div>
        </div>

        <div className="mt-10 mb-10 flex flex-col items-center bg-blue-900 rounded-lg p-3">

          {/* name */}
          <div className="mb-2"><Tag size="md" variant="outline" colorScheme="blue">error name</Tag></div>
          <div>{props.error?.name}</div>

          {/* message */}
          <div className="mt-5 mb-2"><Tag size="md" variant="outline" colorScheme="blue">error message</Tag></div>
          <div>{props.error?.message}</div>

          {/* stack */}
          <div className="mt-5 mb-2"><Tag size="md" variant="outline" colorScheme="blue">error stack</Tag></div>
          <pre className="text-gray-400 text-xs">{props.error?.stack}</pre>

        </div>
      </div>

      {/* フッター */}
      <div className="flex justify-center items-center bg-gray-900 select-none" style={{height: "25px"}}>
        <AppFooter />
      </div>

  </div>
)
}