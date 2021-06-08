// 第一引数の要素の祖先から、第二引数のキー名のデータセットを持つ要素のデータセットを返す
export const getAncestorDataset = (element: HTMLElement, key: string, maxLoopCount: number = 10) : any => {  //戻値の型どうにかして
  let datasetTarget = element;
  let dataset;
  for(let i=0; ; i++) {
    // 最初だけ自身を探索
    if (i===0) {
      dataset = datasetTarget.dataset;
      if (dataset?.[key]) {
        return dataset;
      }
    }

    // 親要素を探索（これを繰り返させる）
    dataset = datasetTarget.parentElement.dataset;
    if (dataset?.[key]) {
      return dataset;
    }
    datasetTarget = datasetTarget.parentElement;

    // あまりにもループが長い場合は探索終了
    if (i >= maxLoopCount) {
      return null;
    }
  }
}

