/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ABSENT } from "../constants.export";
import { type } from "@wonderlandlabs/walrus";

export function typeTest(type: string) {
  return (value: any) => typeof value === type;
}

export function isThere(item: any) {
  return ![ABSENT, undefined].includes(item);
}

// isEmpty is NOT a simple syntactic inverse of isThere; it includes null,
// which is not a qualifier of isThere.
export function isEmpty(item: any) {
  return [ABSENT, null, undefined].includes(item);
}

export const isNum = typeTest('number');

/**
 * a type check; if nonEmpty = true, only true if array has indexed values.
 * @param a
 * @param nonEmpty
 * @returns {boolean}
 */
export function isArr(a: any, nonEmpty = false) {
  return !!(Array.isArray(a) && (!nonEmpty || a.length));
}

export const isMap = (m: any) => m instanceof Map;

/**
 * returns true if the object is a POJO object -- that is,
 * its non-null, is an instance of Object, and is not an array.
 *
 * @param o
 * @param isAnyObj {boolean} whether arrays, maps should be included as objecg
 * @returns {boolean}
 */
export function isObj(o: any, isAnyObj = false) {
  return o && typeof o === 'object' && (isAnyObj || !(isArr(o) || isMap(o)));
}

export const isFn = typeTest('function');

export const isDate = (d: any) => d instanceof Date;

export const isSet = (d: any) => d instanceof Set;

export const isSymbol = typeTest('symbol');

export function isWhole(value: any) {
  if (!isNum(value)) {
    return false;
  }
  return value >= 0 && !(value % 2);
}

/**
 * returns a decorated error; an Error instance with extra annotations
 * @param err
 * @param notes
 */
export const e = (err: any, notes = {}) => {
  if (typeof err === 'string') {
    err = new Error(err);
  }
  if (!isThere(notes)) {
    notes = {};
  } else if (!isObj(notes)) {
    notes = { notes };
  }
  return Object.assign(err, notes);
};

export function isStr(s: any, nonEmpty = false) {
  if (typeof s === 'string') {
    return nonEmpty ? !!s : true;
  }
  return false;
}

export const isUndefined = typeTest('undefined');

export function formIsCompound(form: string) {
  return [
    "map",
    "map",
    "array",
    "object",
    "set"
  ].includes(form);
}

export function returnOrError(fn: any, ...args: any[]) {
  if (typeof fn !== 'function') {
    throw new Error('returnOrError MUST be passed a function');
  }
  try {
    return fn(...args);
  } catch (err) {
    return err;
  }
}
