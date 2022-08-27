import { ComparatorBaseFn } from "lib/shared/comparator";

export type SortFromTo = {
  from?: number;
  to?: number;
}

export type Sorter = <T extends { [index: number]: any; length: number }>(arr: T, comparator?: ComparatorBaseFn<T>, option?: SortFromTo) => T; 