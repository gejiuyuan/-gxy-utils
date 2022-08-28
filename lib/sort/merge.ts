/** @format */

import { defaultComparatorBaseFn, EMPTY_OBJECT } from '../shared';
import { Sorter } from './types';

/**
 * 归并排序（递归版）
 * @param arr
 * @param comparator
 * @param param2
 * @returns
 */
export const mergeSort: Sorter = function (
	arr,
	comparator = defaultComparatorBaseFn,
	{ from = 0, to = arr.length - 1 } = EMPTY_OBJECT,
) {
	if (arr.length < 2 || from === to) {
		return arr;
	}

	process(from, to);
	function process(left: number, right: number) {
		if (left === right) {
			return;
		}
		// 取中间值，注：之所以不用(left + right) / 2，是为了避免left+right超过了所能接受的最大数字导致的错误
		const middle = left + ((right - left) >>> 1);
		process(left, middle);
		process(middle + 1, right);
		merge(left, middle, right);
	}

	// 递归到最深度时，left为0，middle为0，right为1，即区间长度为2
	function merge(left: number, middle: number, right: number) {
		const helperArr = Array.from({ length: right - left + 1 });
		let i = 0;
		// 左边区间的指针
		let pointer1 = left;
		// 右边区间的指针
		let pointer2 = middle + 1;
		// 当两个区间的指针没有越界时
		while (pointer1 <= middle && pointer2 <= right) {
			helperArr[i++] =
				comparator(arr[pointer1], arr[pointer2]) <= 0 ? arr[pointer1++] : arr[pointer2++];
		}
		// 此时要么p1越界，要么p2越界，不可能出现共同越界。下面两个while只会中一个
		// 没越界的一方直接把剩余的值顺序填入即可。因为merge左侧与右侧两边的数组一定是排序好的

		// 如果p1没越界
		while (pointer1 <= middle) {
			helperArr[i++] = arr[pointer1++];
		}
		// 如果p2没越界
		while (pointer2 <= right) {
			helperArr[i++] = arr[pointer2++];
		}

		// 最后把次区间内的排序号的元素填回到原数组
		for (i = 0; i < helperArr.length; i++) {
			arr[left + i] = helperArr[i];
		}
	}

	return arr;
};
