import toString from "lodash.tostring";
import { formIsCompound, isEmpty } from './tests';
import {type} from "@wonderlandlabs/walrus";

const simpleTypeOrder: string[] = [
  "undefined",
  "null",
  "number",
  "string",
];

function compareTypes(a: any , b: any, typeA?: string, typeB?: string): number {
  if (!typeA) {
    typeA = type.describe(a, true) as string;
  }
  if (!typeB) {
    typeB = type.describe(b, true) as string;
  }

  if (typeA === "date") {
    if (typeB === "date") {
      return compareTypes(
        (a as Date).getTime(),
        (b as Date).getTime(),
        "number",
        "number"
      );
    } else {
      return compareTypes((a as Date).getTime(), b, "number", typeB);
    }
  } else if (typeB === "date") {
    return compareTypes(a, (b as Date).getTime(), typeA, "number");
  }

  // order some types by type
  if (typeA !== typeB) {
    if (simpleTypeOrder.includes(typeA) && simpleTypeOrder.includes(typeB)) {
      const diff = simpleTypeOrder.indexOf(typeA) - simpleTypeOrder.indexOf(typeB);
      return diff / Math.abs(diff);
    }
  }

  // compare numbers by value.
  if (typeA === "number" && typeB === "number") {
    return (a - b) / Math.abs(a - b);
  }

  // compare strings by value;
  // sort strings before non-strings
  if (typeA === "string") {
    if (typeB === "string") {
      if (a > b) {
        return 1;
      }
      return -1;
    } else {
      return -1;
    }
  } else if (typeB === "string") {
    return 1;
  }

  /* eslint-disable no-else-return */
  if (formIsCompound(typeA)) {
    if (formIsCompound(typeB)) {
      return compareTypes(
        toString(a),
        toString(b),
        "string",
        "string"
      );
    } else {
      return 1;
    }
  } else if (formIsCompound(typeB)) {
    return compareTypes(a, toString(b), typeA, "string");
  }

  if (a > b) {
    return 1;
  }
  return -1;
}

/**
 * the rule or the sort function is :
 * if the values are equal, return 0;
 * if (b > a) return 1; -- sort is b, a
 * if (a > b) return -1; -- sort is a, b
 * @param a
 * @param b
 */
export default function compare(a: any, b: any) {
  if (a === b) {
    return 0;
  }

  if (isEmpty(a)) {
    if (isEmpty(b)) {
      return 0;
      return -1;
    }
  } else if (isEmpty(b)) {
    return 1;
  }

  return compareTypes(a, b);
}
