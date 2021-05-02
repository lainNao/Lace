import React, { useEffect } from 'react';
import { useHomeService } from '../hooks/useHomeService'
import { useForceUpdate } from '../hooks/useForceUpdate'
import { columnSpacesType } from '../@types/app'
import { HomeView } from "../views/HomeView"

/*
  絶対パスでimportできるようにする
  サービスをre-ducksパターンとかそういうのに切り出すか…
  useEffect類はカスタムフックスにきりだすなど…
*/

const HomeController: React.FC = () => {

  const forceUpdate = useForceUpdate();

  const {
    service,
    columnSpaceDB,
    setColumnSpaceDB,
    currentColumnSpaceUUID,
    currentMainDisplayedColumnUUID,
  } = useHomeService({
    currentColumnSpaceUUID: "test_column_space",              //仮のモック
    currentMainDisplayedColumnUUID: "test_file_column_uuid",  //仮のモック
  });

  // D&Dの制御
  useEffect(() => {

    document.ondragover = document.ondrop = (e) => {
      e.preventDefault();
    }

    // いずれdocument.bodyへのドロップじゃないのに変えるべき
    // そもそもファイル類追加のときのみDnDを受け入れるようにする
    document.body.ondrop = async (e) => {
      /*
        今はメインのカラムに追加しか対応してないけど、特定のセルの今のカーソル位置に追加とか、子カラムの特定セルに追加とかもできるようにする
        ファイルの種類のバリデーションをすること
        ローディングスピナーでも出すこと
        ファイル名のバリデーションをすること（スラッシュとかいろいろあるとバグるので）
        ファイルサイズのバリデーションをすること（あまりにもでかすぎる場合確認取るなど）
        同名ファイルは「(2)」とかつけるようにすること
        エラー起きたらいい感じに表示すること
        ファイルが入ったら、リストアイテムの表示を更新すること
        リストアイテムの表示は軽くすること
        アップロード完了したらファイルのパスをDBに保存すること（そしてメモリに展開すること）（single truth of source的なものも実現させたいところ…）
        そしてリビルドさせること
        ひとまずはmainDisplayedColumnにアップロードさせるが、後で他カラムに使うファイルのアップロードにも対応させること
        ひとまずメモリ上でjson型のDBを作り、定期保存かつ、windowが閉じられた時に保存するような仕様にする
        asyncだと後々難しい場合、syncで全部やるのも考える
      */
      const droppedFileList = e.dataTransfer.files;
      if (!droppedFileList.length) {
        return;
      }
      const newColumnSpaceDB: columnSpacesType = await service.uploadFiles(droppedFileList, currentMainDisplayedColumnUUID);
      setColumnSpaceDB(() => newColumnSpaceDB);
    }
  }, [columnSpaceDB])

  return (
    <HomeView
      columnSpaceDB={columnSpaceDB}
      currentColumnSpaceId={currentColumnSpaceUUID}
      currentMainColumnId={currentMainDisplayedColumnUUID}
      forceUpdateHome={forceUpdate}
      service={service}
      />
  )
}

export default HomeController;
