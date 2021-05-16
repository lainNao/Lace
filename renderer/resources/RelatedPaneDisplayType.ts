export enum RelatedPaneDisplayType {
  VNormal = "VNormal",                    //通常の改行リスト
  VNumber = "VNumber",                    //数値前置の箇条書き
  HNormal = "HNormal",                    //言語ごとのセパレータで分けた横並び（日本語なら「、」）
  // 特殊
  Table = "Table",                        //テーブル表示（テーブルカラムは自動でこれになり、その他は使えない）
  ChordProgression = "ChordProgression",  //コード進行表示（コード進行カラムは自動でこれになり、その他は使えない）

  //TODO 順次追加
}