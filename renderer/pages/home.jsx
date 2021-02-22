import React, { useState, useEffect } from 'react';
import { HeadThreeColumnFoot, Header, Left, Center, Right, Footer } from '../components/layouts/HeadThreeColumnFoot'
import { readFile, copyFile, writeFile, existsSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { databaseFilePath } from '../consts/path'
import { DBService } from '../services/DBService'
/*
  絶対パスでimportできるようにする
*/

const Home = () => {

  const [columnspaceDB, setColumnspaceDB] = useState(null)
  const currentColumnSpaceUUID = "test_column_space"    //仮のモック
  const currentMainDisplayedColumnUUID = "test_file_column_uuid"
  const currentMainDisplayedColumnDatas = (columnspaceDB !== null) ? columnspaceDB[currentColumnSpaceUUID].columns[currentMainDisplayedColumnUUID].datas : null;

  // DBの読み込み
  useEffect(() => {
    const readOrCreateDatabase = async () => {
      const dbService = new DBService({
        databaseFilePath : databaseFilePath,
      });
      setColumnspaceDB(await dbService.readOrCreateDatabase());
    }

    readOrCreateDatabase();
  }, []);

  // D&Dの制御
  useEffect(() => {

    document.ondragover = document.ondrop = (e) => {
      e.preventDefault();
    }

    document.body.ondrop = (e) => {
      /*
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
        asyncだと後々難しい場合、synkで全部やるのも考える
      */
      const droppedFileList = e.dataTransfer.files;
      Array.from(droppedFileList).forEach(droppedFile => {
        const filePath = `userdata/column_spaces/${currentColumnSpaceUUID}/${currentMainDisplayedColumnUUID}/${droppedFile.name}`;
        const savePath = `renderer/public/${filePath}`;
        copyFile(droppedFile.path, savePath, (error) => {
          if (error) {
            console.log(error.stack);
            return;
          }

          const newColumnSpaceDB = Object.assign({}, columnspaceDB);
          const newFileUUID = uuidv4();
          newColumnSpaceDB[currentColumnSpaceUUID].columns[currentMainDisplayedColumnUUID].datas[newFileUUID] = {
            path: filePath,
            type: droppedFile.type,
            name: droppedFile.name,
            childs_columns_datas: {},    //この時点では空にし、後々セットする時にこの中身は持たせる。なぜならば、ここでファイル取り込みした後にchild_columnsの中の要素が増える可能性があるため。
          };

          setColumnspaceDB((currentState) =>  newColumnSpaceDB);
          console.log('ファイル取り込み完了');

          writeFile(databaseFilePath, JSON.stringify(newColumnSpaceDB, null, "\t"), "utf8", (error) => {
            if (error) {
              console.log(error.stack);
              return;
            }

            console.log("DB書き出し完了");
          })
        })
      })
    }
  }, [columnspaceDB])

  if (columnspaceDB === null) {
    return (
      <div>DB読込中</div>
    )
  }

  return (
    <React.Fragment>
			<HeadThreeColumnFoot>
        <Header>header</Header>
        <Left>left</Left>
        <Center>
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
        </Center>
        <Right>right</Right>
        <Footer>footer</Footer>
			</HeadThreeColumnFoot>
    </React.Fragment>
  )
}

export default Home;
