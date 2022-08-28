/** @format */

export type ComparatorFn<T> = (o1: T, o2: T) => boolean;

export type ComparatorBaseFn<T> = ConstructorParameters<typeof Comparator<T>>[0];

export const defaultComparatorBaseFn = (o1: any, o2: any) => o1 - o2;

export class Comparator<T> {
	constructor(private readonly compareFunc: (o1: T, o2: T) => number = defaultComparatorBaseFn) {}

	equal = (...args: Parameters<typeof this.compareFunc>) => {
		return this.compareFunc(...args) === 0;
	};

	lessThan = (...args: Parameters<typeof this.compareFunc>) => {
		return this.compareFunc(...args) < 0;
	};

	greaterThan = (...args: Parameters<typeof this.compareFunc>) => {
		return this.compareFunc(...args) > 0;
	};

	lessOrEqualThan = (...args: Parameters<typeof this.compareFunc>) => {
		return this.equal(...args) || this.lessThan(...args);
	};
}
