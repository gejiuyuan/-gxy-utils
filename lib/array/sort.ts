/** @format */

import { ComparatorBaseFn, defaultComparatorBaseFn } from '../shared';
import { insertionSort } from '../sort';

/**
 * 参考Array.prototype.sort实现
 * 详见：https://github.com/v8/v8/blob/98d735069d0937f367852ed968a33210ceb527c2/src/js/array.js#L709
 * @export
 * @template T
 * @param {Array<T>} arr
 * @return {*}
 */
export function ArraySort<T = any>(
	arr: Array<T>,
	comparefn: ComparatorBaseFn<T> = defaultComparatorBaseFn,
) {
	doSort(arr, 0, arr.length);

	function doSort(arr: Array<T>, from: number, to: number) {
		// 哨兵元素索引
		let sentinelIndex = 0;

		while (true) {
			const interval = to - from;

			if (interval < 10) {
				insertionSort(arr, comparefn, { from, to: to - 1 });
				return;
			}
			// 更新哨兵索引：如果长度小于1000，直接使用中间索引，否则取每隔200-215个元素排序后的中间值索引
			sentinelIndex =
				interval > 1000 ? from + (interval >> 1) : getSentinelIndex(arr, from, to);

			let { [from]: leftValue, [sentinelIndex]: sentinelValue, [to - 1]: rightValue } = arr;

			// [9, 4, 6, 19, 8]

			// 首先最左边与最右边的值比较。即：9和8比较
			const leftRightCompared = comparefn(leftValue, rightValue);
			// 比较结果大于0，则互换位置。即：9和8互换
			if (leftRightCompared > 0) {
				const tmp = leftValue;
				leftValue = rightValue;
				rightValue = tmp;
			}
			// 然后最左边与哨兵元素的值比较。即：8和6比较
			const leftSentinelCompared = comparefn(leftValue, sentinelValue);
			// 结果仍然大于等于0，亦互换位置。即：8和6互换，再8和9互换
			if (leftSentinelCompared >= 0) {
				const tmp = leftValue;
				leftValue = sentinelValue;
				sentinelValue = rightValue;
				rightValue = tmp;
			} else {
				const c12 = comparefn(rightValue, sentinelValue);
				if (c12 > 0) {
					// v0 <= v2 < v1
					const tmp = rightValue;
					rightValue = sentinelValue;
					sentinelValue = tmp;
				}
			}
			// v0 <= v1 <= v2
			arr[from] = leftValue;
			arr[to - 1] = sentinelValue;
			const pivot = rightValue;
			let lowEnd = from + 1; // Upper bound of elements lower than pivot.
			let highStart = to - 1; // Lower bound of elements greater than pivot.
			arr[sentinelIndex] = arr[lowEnd];
			arr[lowEnd] = pivot;

			// From low_end to i are elements equal to pivot.
			// From i to high_start are elements that haven't been compared yet.
			partition: for (var i = lowEnd + 1; i < highStart; i++) {
				var element = arr[i];
				var order = comparefn(element, pivot);
				if (order < 0) {
					arr[i] = arr[lowEnd];
					arr[lowEnd] = element;
					lowEnd++;
				} else if (order > 0) {
					do {
						highStart--;
						if (highStart == i) break partition;
						var top_elem = arr[highStart];
						order = comparefn(top_elem, pivot);
					} while (order > 0);
					arr[i] = arr[highStart];
					arr[highStart] = element;
					if (order < 0) {
						element = arr[i];
						arr[i] = arr[lowEnd];
						arr[lowEnd] = element;
						lowEnd++;
					}
				}
			}
			if (to - highStart < lowEnd - from) {
				doSort(arr, highStart, to);
				to = lowEnd;
			} else {
				doSort(arr, from, lowEnd);
				from = highStart;
			}
		}
	}

	/**
	 * 获取哨兵（枢纽候选者）元素索引值
	 * @description
	 *  1、每隔200到215个元素选择一个哨兵作为参考
	 *  2、然后把这些元素再次排序，选择中间值(的索引)作为最终候选者
	 * @param {Array<T>} arr
	 * @param {number} from
	 * @param {number} to
	 * @return {*}
	 */
	function getSentinelIndex(arr: Array<T>, from: number, to: number) {
		const tmpArr = new Array<[number, T]>();
		const increment = 200 + ((to - from) & 15);
		from++;
		to--;
		let j = 0;
		for (let i = from; i < to; i += increment) {
			tmpArr[j++] = [i, arr[i]];
		}
		tmpArr.sort((a, b) => comparefn(a[1], b[1]));
		return tmpArr[tmpArr.length >> 1][0];
	}

	return arr;
}
