import type { optionsObj } from '../types';

export default abstract class Match {
  static sameKey(
    key: any,
    k2: any,
    context: optionsObj,
    many = true, // individually compare keys if arrays
    debug = false
  ) {
    if (many && Array.isArray(k2)) {
      return k2.some((otherSubKey) => {
        const use = context?.compKeys
          ? context.compKeys(key, otherSubKey)
          : key === otherSubKey;
        if (debug) {
          console.log(
            'MATCH subkey comparison: ',
            otherSubKey,
            'to first key',
            key,
            'result: ',
            use
          );
        }
        return use;
      });
    }
    if (!context?.compKeys) {
      return key === k2;
    }
    return context.compKeys(key, k2);
  }

  static sameItem(item: any, i2: any, context: optionsObj, many = true) {
    if (!context?.compItems) {
      return item === i2;
    }
    if (many && Array.isArray(i2)) {
      const out = i2.some((otherSubItem) => {
        if (context?.compItems) {
          return context.compItems(item, otherSubItem);
        } else {
          return item === otherSubItem;
        }
      });
      return out;
    }
    const out = context.compItems(item, i2);
    return out;
  }
}
