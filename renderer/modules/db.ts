import { DbFileNameEnum } from "../resources/enums/app"
import AsyncLock from 'async-lock';
import { DB_DIR_PATH } from "../resources/consts/path";
import path from "path";
import fs from 'fs'
import { getSaveDirPath } from "./ipc";
import {version} from '../../package.json';


const lock = new AsyncLock(); //NOTE: 共有しないとロックされないのでグローバルに置いちゃう

// DBファイル達を全ロックかけてトランザクションをする。第一引数はユースケースの処理を入れる
export const DbFilesExclusiveTransaction = async (asyncFunc: () => Promise<any>): Promise<any> => {
  const tmpFilePrefix = "_tmp_";

  return lock.acquire("exclusive-transaction", async () => {
    let needRestore, result, hasBackuped;
    const saveDirPath = await getSaveDirPath();

    try {
      // 1,バックアップ（「_tmp_元ファイル名」を同一フォルダに作る）
      for (const dbFileName in DbFileNameEnum) {
        const dbFilePath = path.join(saveDirPath, DB_DIR_PATH, DbFileNameEnum[dbFileName]);
        const tempDbFilePath = path.join(saveDirPath, DB_DIR_PATH, tmpFilePrefix + DbFileNameEnum[dbFileName]);
        await fs.promises.copyFile(dbFilePath, tempDbFilePath);
      }

      hasBackuped = true;

      try {
        result = await asyncFunc(); //2,ここでトランザクション対象の処理を発火
      } catch(argFuncError) {
        needRestore = true;
        throw argFuncError;
      }

      // 3,ここまで来たら成功してるということなのでバックアップ消す
      for (const dbFileName in DbFileNameEnum) {
        const tempDbFilePath = path.join(saveDirPath, DB_DIR_PATH, tmpFilePrefix + DbFileNameEnum[dbFileName]);
        await fs.promises.unlink(tempDbFilePath);
      }

      return result;
    } catch (err) {

      console.debug("リストアします");

      // 2の段階でのエラーの場合、リストア
      if (needRestore) {
        let restored, lastAction;
        try {
          for (const dbFileName in DbFileNameEnum) {
            // バックアップからリストア（元ファイルをdelete + バックアップをrename）
            const dbFilePath = path.join(saveDirPath, DB_DIR_PATH, DbFileNameEnum[dbFileName]);
            const tempDbFilePath = path.join(saveDirPath, DB_DIR_PATH, tmpFilePrefix + DbFileNameEnum[dbFileName]);
            lastAction = DbFileNameEnum[dbFileName] + " unlink failed";
            await fs.promises.unlink(dbFilePath);
            lastAction = path.join(tmpFilePrefix, DbFileNameEnum[dbFileName]) + " rename failed";
            await fs.promises.rename(tempDbFilePath, dbFilePath)
          }
          restored = true;
          throw err;
        } catch (restoreErr) {
          // リストアに成功したらそのまま前のエラーを上に伝達する
          if (restored) {
            throw err;
          }

          // ※ここだけ毛色違う
          // リストア自体に失敗した場合、とりあえずアラート出す。単に_tmp_を手動リストアすればいいので
          // ただし「削除」「リネーム」の順番のどこで失敗したかによって順番があるので人間の判断を入れたほうがいいからそれはヘルプにでも書いておくか後ほど…
          alert("一時バックアップからのリストアに失敗しました。若干不整合が起きるかもなので、このアラートをOK押さず、アプリケーションをそのまま触らないで、ブラウザ開いて公式サイトかgithubかのFAQとかに書いてあるかもしれない手順に従って復旧してください。特にFAQ的なものが見当たらない場合は作者見つけてください暇なら対応できます")
          alert("アプリバージョン： "+ version);
          alert("最後のアクション： "+ lastAction);
          // TODO 一応ログにも最後のアクションを残しておきたいところ…消す人いると思うので…まあ後で…
          // TODO というかこここんなに煩雑なの怠いので他の策も考えたいところ…
          throw restoreErr;
        }
      }
      // 1か3の段階でのエラーの場合、まあスルーで問題は無い
      else {
        if (hasBackuped) {
          // バックアップは無事作成済みの場合、バックアップを消すのに失敗しただけなのでスルー
          throw err;
        } else {
          // バックアップ自体作成に失敗した場合も、そのままにしておけば上書きされるのでスルー
          throw err;
        }
      }
    }
  })

}