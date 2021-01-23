export const mockdata = {
  test_column_space: {                     //カラムスペースのUUID
    id: 1,                      //カラムスペースのID
    name: "test",                   //カラムスペース名
    medias: {
      "testMediaUUID": {                     //メディアのUUID
        type: "test",           //メディア種類
        name: "testfilename",
        path: "userdata/test_column_space/1125362.jpg",           //メディアへのpath
        columns_data: {
          testColumnUUID: "aaa",   //カラムのデータ
        },
      }
    },
    columns: {
      testColumnUUID: {                     //カラムのUUID
          name: "testcolumn",         //カラム名
          type: "testtype",           //カラムのタイプ（bool, tag, text, markdown, select, radio, combo, event(javascriptで定義。任意のカラムの値が変更されたら発火するイベントを作れる)）
          collapsable: false,    //コラプスするタイプかどうか（これがtrueなカラムがある場合、メディアの左側にコラプスアイコンつけることになる）
      }
    }
  }
}
