import React, { useState, useEffect } from 'react';
import { DB_FILE_PATH, PUBLIC_PATH } from '../consts/path';
import { HomeService } from '../services/HomeService';
import { HomeRepositoryJson } from '../repositories/HomeRepositoryJson';
import { columnspaceDB } from '../@types'
import { IHomeService } from '../@types/services'

/*
  絶対パスでimportできるようにする
  サービスをre-ducksパターンとかそういうのに切り出すか…
  useEffect類はカスタムフックスにきりだすなど…
*/

const Home: React.FC = () => {

  const [columnspaceDB, setColumnspaceDB] = useState<columnspaceDB>(null);
  const [service, setService] = useState<IHomeService>(null);
  const currentColumnSpaceUUID: string = "test_column_space";    //仮のモック
  const currentMainDisplayedColumnUUID: string = "test_file_column_uuid";
  const currentMainDisplayedColumnDatas = (columnspaceDB !== null)
      ? columnspaceDB[currentColumnSpaceUUID].columns[currentMainDisplayedColumnUUID].datas
      : null;

  // サービスの読み込み
  useEffect(() => {
    setService(() => new HomeService({
      repository: new HomeRepositoryJson({
        dbFilePath: DB_FILE_PATH,
        currentColumnSpaceUUID,
        publicPath: PUBLIC_PATH
      }),
    }));
  }, []);

  // DBの読み込み
  useEffect(() => {
    const readOrCreateDB = async () => {
      setColumnspaceDB(await service.readOrCreateDB());
    }
    if (service) {
      readOrCreateDB();
    }
  }, [service]);

  // D&Dの制御
  useEffect(() => {

    document.ondragover = document.ondrop = (e) => {
      e.preventDefault();
    }

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
      const newColumnSpaceDB = await service.uploadFiles(droppedFileList, currentMainDisplayedColumnUUID);
      setColumnspaceDB(() => newColumnSpaceDB);
    }
  }, [columnspaceDB])

  if (columnspaceDB == null) {
    return (
      <div>DB読込中</div>
    )
  }

  return (
    <React.Fragment>
      <div className="flex flex-row w-screen h-screen">

        <div className="h-screen min-w-300  overflow-y-auto p-3">
          left
        </div>

        <div className="h-screen overflow-y-auto p-3">
          {
            Object.keys(currentMainDisplayedColumnDatas).map((dataUUID, index) => {
              const data = currentMainDisplayedColumnDatas[dataUUID]
              return (
                  <div key={`${data.name}-${index}`}>
                    <div><img src={data.path} /></div>
                    <div>{data.name}</div>
                  </div>
                )
            })
          }
        </div>

        <div className="h-screen min-w-300 overflow-y-auto p-3">
          right
        </div>

      </div>
    </React.Fragment>
  )
}

export default Home;
