import cloneDeep from 'lodash.clonedeep';
import { isThere } from './tests';
import { ABSENT } from "../constants.export";
import {type} from "@wonderlandlabs/walrus"

export const clone = cloneDeep;

export function makeEmpty(likeThis: any, typeName?: string) {
  if (!isThere(typeName)) {
    typeName = type.describe(likeThis, true) as string;
  }
  let out = likeThis;
  switch (typeName) {
    case "number":
      out = 0;
      break;

    case "string":
      out = '';
      break;

    case "map":
      out = new Map();
      break;

    case "object":
      out = {};
      break;

    case "array":
      out = [];
      break;

    case "date":
      out = new Date();
      break;

    case "set":
      out = new Set();
      break;

    case "symbol":
      out = Symbol('');
      break;

    default:
      out = null;
  }
  return out;
}

/**
 * merge similar form
 * @param value
 * @param change
 * @param form
 */
export function amend(value: any, change: any[], form: string | symbol = ABSENT) {
  if (!isThere(form)) {
    form = type.describe(value, 'form') as string;
  }
  let out = value;
  switch (form) {
    case "map":
      out = new Map(value);
      change.forEach((keyValue, key) => {
        out.set(key, keyValue);
      });
      break;

    case "object":
      out = { ...value };
      Object.keys(change).forEach((key) => {
        // @ts-ignore
        out[key] = change[key];
      });
      break;

    case "array":
      out = [...value];
      change.forEach((item, index) => {
        out[index] = item;
      });
      break;

    default:
      console.warn('unhandled amend form:', form);
  }
  return out;
}
