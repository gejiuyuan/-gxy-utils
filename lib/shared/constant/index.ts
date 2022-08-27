import { PlainObject } from "../types";

export const EMPTY_ARRAY = Object.freeze(new Array()) as unknown[];

export const EMPTY_OBJECT = Object.freeze(Object.create(null)) as PlainObject;