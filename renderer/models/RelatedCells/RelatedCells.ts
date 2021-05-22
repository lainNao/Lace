import { assert } from "console";
import { merge } from "lodash";
import { CellRelationFormData } from "../../pages.partial/home/CellRelationModal";
import { difference } from "lodash"

interface ConstructorArgs {
  data: RelatedCellsColumnSpaceIndicator,
}

export class RelatedCells {

  private _data: RelatedCellsColumnSpaceIndicator;

  get data() { return this._data; }

  constructor(args: ConstructorArgs) {
    assert(args != null, "値がありません");

    this._data = args.data;
  }

  static fromJSON(json) {
    return new RelatedCells({
      data: json,
    });
  }

  toJSON() {
    return this._data;
  }

  /*
    ■以下構想を愚直に実装するメソッド
      セルA5があったとしてセルB3、B4、B5に結びつけるとする。
      そのために、「A5の関連セルを設定する画面」のチェックボックスが以下のようなデータを吐き出すとする。
          A5 -> [B3, B4, B5]		//フォームのデータ
          me     target
      で、DBのデータのもたせ方は以下みたいだとする。
          A5 -> [B3, B4, B5, B6]　←B6は今「チェックを外したデータ」だとする。消したい
          B3 -> [A5]
          B4 -> [A5]
          B5 -> [A5, X1] ←X1はもともとあったデータだとする。残したい
          B6 -> [A5,V1]　←A5は今「チェックを外したデータ」だとする。削除したい。V1は残したい
            ちょっと休憩！！！！！！！！！！！！！！！！！！！！！（3分）
      どうやる？
        ・今「A5の関連先」として設定されたB3,B4,B5からの関連先のもともとあったレコードは、残す。A5の関連先は上書き
          deletedCells =A5->update(B3,B4,B5)	//B6消えました👏
          B3,B4,B5->upsert(A5)		//X1残りました👏
          //deletedCellsが[B6]だとする。
        ・もともとあった、「A５の関連先」として設定されていたけど今送られてこなかったセルの関連は、消す
          deletedCells.forEach(deletedCell => {
            deletedCell->deleteCell(A5)	//B6->[V1] だけになりました👏
          })
  */
  updateRelatedCellsByCellRelationFormData(columnSpaceId: string, cellRelationFormData: CellRelationFormData): RelatedCells {
    const meColumnId = cellRelationFormData.targetCell.columnId;
    const meCellId = cellRelationFormData.targetCell.cellId;

    /*この部分
        ・今「A5の関連先」として設定されたB3,B4,B5からの関連先のもともとあったレコードは、残す。A5の関連先は上書き
         deletedCells = A5->update(B3,B4,B5)」
    */
    const deletedFromMes = [];
    Object.keys(cellRelationFormData.relatedCells).forEach(toColumnId => {
      cellRelationFormData.relatedCells[toColumnId].cellIds.forEach(toCellId => {
        // js的な事務作業
        this.createRelatedCellsTreeIfNotExists(
          columnSpaceId,
          {columnId: meColumnId, cellId: meCellId},
          {columnId: toColumnId, cellId: toCellId}
        );
      })

      this.createRelatedCellsTreeIfNotExists(
        columnSpaceId,
        {columnId: meColumnId, cellId: meCellId},
        {columnId: toColumnId}
      );

      deletedFromMes.push({
        column: toColumnId,
        cells: difference(this._data[columnSpaceId][meColumnId][meCellId][toColumnId], cellRelationFormData.relatedCells[toColumnId].cellIds)
      })

      this._data[columnSpaceId][meColumnId][meCellId][toColumnId] = cellRelationFormData.relatedCells[toColumnId].cellIds;
    })

    /* ここ
    		B3,B4,B5->upsert(A5)		//X1残りました👏
    */
    Object.keys(cellRelationFormData.relatedCells).forEach(toColumnId => {
      cellRelationFormData.relatedCells[toColumnId].cellIds.forEach(toCellId => {
        this._data[columnSpaceId][toColumnId][toCellId][meColumnId]
          = Array.from(new Set([...this._data[columnSpaceId][toColumnId][toCellId][meColumnId], meCellId]))
      })
    })

    /*　ここ
        deletedCellsが[B6]だとする。
        ・もともとあった、「A５の関連先」として設定されていたけど今送られてこなかったセルの関連は、消す
          deletedCells.forEach(deletedCell => {
            deletedCell->deleteCell(A5)	//B6->[V1] だけになりました👏
          })
    */
    deletedFromMes.forEach(deleted => {
      const deletedColumnId = deleted.column;
      deleted.cells.forEach(deletedCellId => {

        this.createRelatedCellsTreeIfNotExists(
          columnSpaceId,
          {columnId: meColumnId, cellId: meCellId},
          {columnId: deletedColumnId, cellId: deletedCellId}
        );

        this._data[columnSpaceId][deletedColumnId][deletedCellId][meColumnId]
          = this._data[columnSpaceId][deletedColumnId][deletedCellId][meColumnId]
            .filter(cellId => cellId !== meCellId)
      })
    })

    return this;
  }

  // @deprecated
  mergeRelatedCellsColumnSpaceIndicator(relatedCellsColumnSpaceIndicators: RelatedCellsColumnSpaceIndicator): RelatedCells {
    merge(this._data, relatedCellsColumnSpaceIndicators);
    return this;
  }

  // mergeRelatedCellsColumnSpaceIndicatorの複数対応版
  mergeRelatedCellsColumnSpaceIndicators(relatedCellsColumnSpaceIndicators: RelatedCellsColumnSpaceIndicator[]): RelatedCells {
    relatedCellsColumnSpaceIndicators.forEach(relatedCellsColumnSpaceIndicators => {
      this.mergeRelatedCellsColumnSpaceIndicator(relatedCellsColumnSpaceIndicators);
    });
    return this;
  }

  // NOTE: 追加しかしないケースが浮かばないので使わない
  addRelatedCellTo(columnSpaceId: string, me: RelatedCellInfo, target: RelatedCellInfo): RelatedCells{
    this.createRelatedCellsTreeIfNotExists(columnSpaceId, me, target);

    this.data[columnSpaceId][me.columnId][me.cellId][target.columnId]  = Array.from(new Set([...this.data[columnSpaceId][me.columnId][me.cellId][target.columnId], target.cellId]));
    this.data[columnSpaceId][target.columnId][target.cellId][me.columnId]  = Array.from(new Set([...this.data[columnSpaceId][target.columnId][target.cellId][me.columnId], me.cellId]));

    return this;
  }

  // NOTE: 追加しかしないケースが浮かばないので使わない
  // addRelatedCellToの複数版
  addRelatedCellsTo(columnSpaceId: string, mes: RelatedCellInfo[], target: RelatedCellInfo): RelatedCells{
    for (let me of mes) {
      this.addRelatedCellTo(columnSpaceId, me, target);
    }
    return this;
  }

  // NOTE: 追加しかしないケースが浮かばないので使わない
  // addRelatedCellsToの第二引数と第三引数逆になってるだけ
  addRelatedCellsFrom(columnSpaceId: string, me: RelatedCellInfo, targets: RelatedCellInfo[]): RelatedCells{
    for (let target of targets) {
      this.addRelatedCellTo(columnSpaceId, me, target);
    }
    return this;
  }

  private createRelatedCellsTreeIfNotExists(columnSpaceId: string, me: RelatedCellInfo, target: RelatedCellInfo): void {
    /// me側のツリーを作る
    if (!this.data[columnSpaceId]) this.data[columnSpaceId] = {};
    if (!this.data[columnSpaceId][me.columnId]) this.data[columnSpaceId][me.columnId] = {};
    if (me.cellId) {
      if (!this.data[columnSpaceId][me.columnId][me.cellId]) this.data[columnSpaceId][me.columnId][me.cellId] = {};
      if (!this.data[columnSpaceId][me.columnId][me.cellId][target.columnId]) this.data[columnSpaceId][me.columnId][me.cellId][target.columnId] = [];
    }

    /// target側も同じくツリーを作る
    if (!this.data[columnSpaceId]) this.data[columnSpaceId] = {};
    if (!this.data[columnSpaceId][target.columnId]) this.data[columnSpaceId][target.columnId] = {};
    if (target.cellId) {
      if (!this.data[columnSpaceId][target.columnId][target.cellId]) this.data[columnSpaceId][target.columnId][target.cellId] = {};
      if (!this.data[columnSpaceId][target.columnId][target.cellId][me.columnId]) this.data[columnSpaceId][target.columnId][target.cellId][me.columnId] = [];
    }
  }

}

export type RelatedCellInfo = {columnId: string, cellId?: string};

export type RelatedCellsColumnSpaceIndicator = {
  [columnSpaceId: string]: RelatedCellsColumnIndicator,

}
export type RelatedCellsColumnIndicator = {
  [columnId: string]: RelatedCellsCellIndicator,
}

export type RelatedCellsCellIndicator = {
  [cellId: string]: RelatedCellsTargetColumnIndicator,
}

export type RelatedCellsTargetColumnIndicator = {
  [columnId: string]: string[]
}
