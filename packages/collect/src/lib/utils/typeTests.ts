import {
  isArr,
  isDate,
  isFn,
  isMap,
  isNum,
  isObj,
  isSet,
  isStr,
  isSymbol,
  isUndefined,
} from './tests';

export const TESTS = [
  { name: "undefined", test: isUndefined, isForm: false },
  { name: "map", test: isMap, isForm: true },
  { name: "symbol", test: isSymbol, isForm: false },
  { name: "array", test: isArr, isForm: true },
  { name: "function", test: isFn, isForm: true },
  { name: "date", test: isDate, isForm: false },
  { name: "set", test: isSet, isForm: true },
  { name: "object", test: isObj, isForm: true },
  { name: "string", test: isStr, isForm: false },
  { name: "number", test: isNum, isForm: false },
  { name: "scalar", test: () => true, isForm: true },
];

/**
 * allow custom form/type definitions by application developer;
 * @param name
 * @param test
 * @param isForm
 * @param order
export function addTest(name, test, isForm = false, order = 0) {
  TESTS.push(name, {name: name, test, isForm, order));
}
*/
