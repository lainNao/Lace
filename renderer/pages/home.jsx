import React, {useEffect} from 'react';
import Head from 'next/head';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Link from '../components/Link';
import {HeadThreeColumnFoot, Header, Left, Center, Right, Footer} from '../components/layouts/HeadThreeColumnFoot'
const fs = require('fs');
import {mockdata} from '../lib/database.mock.js'
const currentColumnSpaceObject = mockdata[0]


const Home = () => {

  const currentColumnSpaceUUID = "test_column_space"    //仮のモック

  useEffect(() => {

    document.ondragover = document.ondrop = (e) => {
      e.preventDefault()
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
        アップロード完了したらファイルのパスをDBに保存すること（そしてメモリに展開すること）
        そしてリビルドさせること
      */
      const fileList = e.dataTransfer.files
      Array.from(fileList).forEach(fileObject => {
        fs.copyFileSync(fileObject.path, `userdata/${currentColumnSpaceUUID}/${fileObject.name}`, (error) => {
          if (error) {
            console.log(err.stack)
            return
          }
          console.log('Done.')
        })
      })
    }
  }, [])

  return (
    <React.Fragment>
			<HeadThreeColumnFoot>
        <Header>header</Header>
        <Left>left</Left>
        <Center>
          {Object.keys(mockdata[currentColumnSpaceUUID].medias).map((mediaUUID) => {
            const media = mockdata[currentColumnSpaceUUID].medias[mediaUUID]
            return <div>{media.name}</div>
          })
        }
        </Center>
        <Right>right</Right>
        <Footer>footer</Footer>
			</HeadThreeColumnFoot>
    </React.Fragment>
  );
};

export default Home;
