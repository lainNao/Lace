// 配列の要素を指定インデックスに移動する
export function array_move(array, fromIndex, toIndex) {
	if (fromIndex === toIndex) {
		return array;
	}

	const targetElem = array.splice(fromIndex, 1)[0];
	array.splice(toIndex, 0, targetElem);
	return array;
}
