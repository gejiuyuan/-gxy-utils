/** @format */

import { defaultComparatorBaseFn } from '../shared/comparator';
import { EMPTY_OBJECT } from '../shared/constant';
import { Sorter } from './types';

/**
 * 插入排序
 * @export
 * @template T
 * @param {T} arr
 * @param {number} [from] 开始索引
 * @param {number} [to] 结束索引
 */
export const insertionSort: Sorter = function (
	arr,
	comparator = defaultComparatorBaseFn,
	{ from = 0, to = arr.length - 1 } = EMPTY_OBJECT,
) {
	for (let i = from + 1; i <= to; i++) {
		const item = arr[i];
		for (let j = i - 1; j >= 0; j--) {
			const tmp = arr[j];
			const order = comparator(tmp, item);
			if (order > 0) {
				arr[j + 1] = tmp;
			} else {
				arr[j + 1] = item;
				break;
			}
		}
	}
	return arr;
};
