import type { optionsObj } from './types';
import MapCollection from './MapCollection';
import ScalarCollection from './ScalarCollection';
import StringCollection from './StringCollection';
import ArrayCollection from './ArrayCollection';
import ObjectCollection from './ObjectCollection';
import SetCollection from './SetCollection';
import { type } from "@wonderlandlabs/walrus";

export default (store: any, options?: optionsObj) => {
  let out;

  switch (type.describe(store, true)) {
    case 'map':
      out = new MapCollection(store, options);
      break;

    case 'string':
      out = new StringCollection(store, options);
      break;

    case 'array':
      out = new ArrayCollection(store, options);
      break;

    case 'object':
      out = new ObjectCollection(store, options);
      break;

    case 'set':
      out = new SetCollection(store, options);
      break;

    default:
      out = new ScalarCollection(store, options);
  }

  return out;
};
