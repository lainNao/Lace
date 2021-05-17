export enum RelatedCellsDisplayType {
  VList = "VList",
  VListDot = "VListDot",
  VListNum = "VListNum",
  HListSeparator = "HListSeparator",
  HListTag = "HListTag",
  CustomList = "CustomList",
}

export const RelatedCellsDisplayTypeStrings = {    //TODO 多言語で返すようにしといて。できるのか知らんけど
  get [RelatedCellsDisplayType.VList]() {
    return "縦リスト";
  },
  get [RelatedCellsDisplayType.VListDot]() {
    return "縦リスト（ドット）";
  },
  get [RelatedCellsDisplayType.VListNum]() {
    return "縦リスト（数）";
  },
  get [RelatedCellsDisplayType.HListSeparator]() {
    return "横リスト（セパレータ）";
  },
  get [RelatedCellsDisplayType.HListTag]() {
    return "横リスト（タグ）";
  },
  get [RelatedCellsDisplayType.CustomList]() {
    return "カスタムリスト";
  },
}
