import { assert } from "console";
import { merge } from "lodash";
import { CellRelationFormData } from "../../pages.partial/home/ColumnSpaceExplorer.partial/CellRelationModal";
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

  // fromからtoへリレーションしているならtrue
  isRelated(columnSpaceId: string, from: RelatedCellInfo, to: RelatedCellInfo) {
    return this._data[columnSpaceId]?.[from.columnId]?.[from.cellId]?.[to.columnId]?.includes(to.cellId) ;
  }

  // そのカラムスペース配下のリレーションを削除
  removeRelationOfColumnSpace(columnSpaceId: string): RelatedCells {
    delete this._data[columnSpaceId];
    return this;
  }

  // そのカラム配下のセルが持つリレーション全部と、そのカラムに向けていたリレーション全部削除
  removeRelationOfColumn(columnSpaceId: string, columnId: string): RelatedCells {
    const relatedCellInfos = this.removeRelationFromColumn(columnSpaceId, columnId);
    this.removeRelationsToColumn(columnSpaceId, relatedCellInfos, columnId);
    return this;
  }

  // そのセルが持つリレーション全部と、そのセルに向けていたリレーション全部削除
  removeRelationOfCell(columnSpaceId: string, columnId: string, cellId: string): RelatedCells {
    const toRelatedCellInfos = this.removeRelationFromCell(columnSpaceId, columnId, cellId);
    if (!toRelatedCellInfos) {
      return this;
    }

    this.removeRelationsToCell(columnSpaceId, toRelatedCellInfos, {columnId, cellId});
    return this;
  }

  // そのセルが持っているリレーションを削除し、削除されたRelatedCellInfoを配列で返す
  private removeRelationFromCell(columnSpaceId: string, columnId: string, cellId: string): RelatedCellInfo[] {

    // リレーションを持ってないなら何もしない
    if (!this._data[columnSpaceId]?.[columnId]?.[cellId]) {
      return null;
    }

    const deletedFromMes: RelatedCellInfo[] = [];
    Object.keys(this._data[columnSpaceId][columnId][cellId]).forEach(toColumnId => {
      this._data[columnSpaceId][columnId][cellId][toColumnId].forEach(toCellId => {
        deletedFromMes.push({ columnId: toColumnId, cellId: toCellId })
      })
    });
    delete this._data[columnSpaceId][columnId][cellId];

    return deletedFromMes;
  }

  //removeRelationToCellのラッパー（第二引数が複数可能）
  private removeRelationsToCell(columnSpaceId: string, fromRelatedCellInfos: RelatedCellInfo[], toRelatedCellInfo: RelatedCellInfo): void {
    for (const relatedCellInfo of fromRelatedCellInfos) {
      this.removeRelationToCell(columnSpaceId, relatedCellInfo, toRelatedCellInfo);
    }
  }

  // 第一から第二引数へのリレーションを削除する
  private removeRelationToCell(columnSpaceId: string, fromRelatedCellInfo: RelatedCellInfo, toRelatedCellInfo: RelatedCellInfo): void {
    this._data[columnSpaceId][fromRelatedCellInfo.columnId][fromRelatedCellInfo.cellId][toRelatedCellInfo.columnId]
      = this._data[columnSpaceId][fromRelatedCellInfo.columnId][fromRelatedCellInfo.cellId][toRelatedCellInfo.columnId].filter((cellId) => cellId !== toRelatedCellInfo.cellId)
  }

  // とあるセル達から、とあるカラムに向けているリレーションを削除
  private removeRelationToColumn(columnSpaceId: string, fromRelatedCellInfo: RelatedCellInfo, toColumnId: string): void {
    delete this._data[columnSpaceId][fromRelatedCellInfo.columnId][fromRelatedCellInfo.cellId][toColumnId];
  }

  // とあるセル達から、とあるカラムに向けているリレーション達を削除（removeRelationToの複数対応版ラッパー）
  private removeRelationsToColumn(columnSpaceId: string, fromRelatedCellInfos: RelatedCellInfo[], toColumnId: string): void {
    for (const relatedCellInfo of fromRelatedCellInfos) {
      this.removeRelationToColumn(columnSpaceId, relatedCellInfo, toColumnId);
    }
  }

  // そのカラムが持っているリレーションを削除し、削除されたRelatedCellInfoを配列で返す
  private removeRelationFromColumn(columnSpaceId: string, columnId: string): RelatedCellInfo[] {

    // 対象が無い場合return
    if (!this._data[columnSpaceId]?.[columnId]) return [];

    // そのカラムが持っているリレーションをカラム、セル単位で回してRelatedCellInfoにして取得
    const relatedCellInfos = [];
    Object.keys(this._data[columnSpaceId][columnId]).forEach(cellId => {
      if (!this._data[columnSpaceId][columnId][cellId]) return [];
      Object.keys(this._data[columnSpaceId][columnId][cellId]).forEach(targetColumnId => {
        if (!this._data[columnSpaceId][columnId][cellId][targetColumnId]) return [];
        this._data[columnSpaceId][columnId][cellId][targetColumnId].forEach(targetCellId => {
          relatedCellInfos.push({
            columnId: targetColumnId,
            cellId: targetCellId,
          })
        })
      })
    })

    // そのカラムが持っているリレーションを削除
    delete this._data[columnSpaceId][columnId];

    return relatedCellInfos;
  }


  /*
    リレーション作成フォームから送られてきたデータでリレーションを上書きする。
    これは複雑になっており正規化も何もされてないが頭が追いつかなかったので暫定で愚直に書いている。
    きれいにしたいならきれいにして。

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

      //TODO ここらへん、なんか自分のカラムから自分のカラムに向けてのリレーションを空で作っちゃってるところあるので見直す。かんたんな操作で再現できるはず。
      this.createRelatedCellsTreeIfNotExists(
        columnSpaceId,
        {columnId: meColumnId, cellId: meCellId},
        {columnId: toColumnId, cellId: null}
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
  addRelatedCellTo(columnSpaceId: string, me: RelatedCellInfo, target: RelatedCellInfo): RelatedCells {
    this.createRelatedCellsTreeIfNotExists(columnSpaceId, me, target);

    this.data[columnSpaceId][me.columnId][me.cellId][target.columnId]  = Array.from(new Set([...this.data[columnSpaceId][me.columnId][me.cellId][target.columnId], target.cellId]));
    this.data[columnSpaceId][target.columnId][target.cellId][me.columnId]  = Array.from(new Set([...this.data[columnSpaceId][target.columnId][target.cellId][me.columnId], me.cellId]));

    return this;
  }

  // NOTE: 追加しかしないケースが浮かばないので使わない
  // addRelatedCellToの複数版
  addRelatedCellsTo(columnSpaceId: string, mes: RelatedCellInfo[], target: RelatedCellInfo): RelatedCells {
    for (let me of mes) {
      this.addRelatedCellTo(columnSpaceId, me, target);
    }
    return this;
  }

  // NOTE: 追加しかしないケースが浮かばないので使わない
  // addRelatedCellsToの第二引数と第三引数逆になってるだけ
  addRelatedCellsFrom(columnSpaceId: string, me: RelatedCellInfo, targets: RelatedCellInfo[]): RelatedCells {
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

export type RelatedCellInfo = {columnId: string, cellId: string};

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
