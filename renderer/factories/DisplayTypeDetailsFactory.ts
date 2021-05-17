import { DisplayDetailCustomList, DisplayDetailHListSeparator } from "../models/DisplaySettings";
import { RelatedCellsDisplayType } from "../resources/RelatedCellsDisplayType";

export class DisplayTypeDetailsFactory {

  static create(relatedCellsDisplayType: RelatedCellsDisplayType, displayDetailData: any) {
    switch (relatedCellsDisplayType) {
      case RelatedCellsDisplayType.HListSeparator: return new DisplayDetailHListSeparator(displayDetailData);
      case RelatedCellsDisplayType.CustomList: return new DisplayDetailCustomList(displayDetailData);
      default: null;
    }
  }
}
