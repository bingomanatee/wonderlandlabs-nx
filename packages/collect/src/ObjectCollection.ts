import CompoundCollection from './CompoundCollection';
import type { collectionObj, optionsObj, orderingFn } from './types';
import Match from './utils/Match';
import { clone } from './utils/change';
import compare from './utils/compare';

type obj = { [key: string]: any };
export default class ObjectCollection extends CompoundCollection
  implements collectionObj<obj, any, any> {
  protected override _store: object;

  constructor(store: object, options?: optionsObj) {
    super(store, options);
    this.update(store, 'constructor', options);
    this._store = store;
  }

  override get size(): number {
    return Array.from(this.keys).length;
  }

  override get keys() {
    return Array.from(Object.keys(this.store));
  }

  override get items(): any[] {
    return Array.from(Object.values(this.store));
  }

  override get(key: any) {
    return this.store[key];
  }

  override set(key: string, item: any) {
    // @ts-ignore
    this._store[key] = item;
    return this;
  }

  override keyOf(item: any): string | undefined {
    const keys = this.keys;
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const oItem = this.get(key);
      if (Match.sameItem(oItem, item, this)) {
        return key;
      }
    }
    return undefined;
  }

  override hasItem(item: any) {
    return this.items.some((oItem) => Match.sameItem(oItem, item, this));
  }

  override hasKey(key: any) {
    return this.keys.some((oKey) => Match.sameKey(oKey, key, this));
  }

  override clear() {
    this.update({}, 'clear');
    return this;
  }

  override deleteKey(key: any) {
    const store = {...this.store};
    delete store[key];
    this.update(store, 'deleteKey', key);
    return this;
  }

  // this is a little dicey but...
  sort(sortFn: orderingFn = compare) {
    const keyArray = Array.from(this.keys).sort(this.sorter(sortFn));
    const newStore = {};
    keyArray.forEach((key: string) => {
      // @ts-ignore
      newStore[key] = this.get(key);
    });

    this.update(newStore, 'sort', sortFn);
    return this;
  }

  clone(newOptions?: optionsObj) {
    return new ObjectCollection(
      clone(this._store),
      this.mergeOptions(newOptions),
    );
  }

  cloneShallow(newOptions?: optionsObj) {
    return new ObjectCollection({...this.store}, this.mergeOptions(newOptions));
  }

  cloneEmpty(newOptions?: optionsObj) {
    return new ObjectCollection(
      {},
      this.mergeOptions(newOptions),
    );
  }

  // iterators

  keyIter(): IterableIterator<any> {
    return Object.keys(this.store)[Symbol.iterator]();
  }

  itemIter(): IterableIterator<any> {
    return Object.values(this.store)[Symbol.iterator]();
  }

  storeIter(): IterableIterator<any> {
    return Object.entries(this.store)[Symbol.iterator]();
  }

  // append/prepend

  // assume that adding a value by key adds to the end of the item
  override addAfter(item: any, key?: any) {
    if (key === undefined) {
      throw new Error('you must define a key to addAfter an item for an object collection');
    }   const newObj = {};
    let put = false;
    this.forEach((oldItem, oldKey: string) => {
      // @ts-ignore
      newObj[oldKey] = oldItem;
      if ((!put) && !this.compItems(item, oldItem)) {
        // @ts-ignore
        newObj[key] = item;
        put = true;
      }
    });
    if (!put) {
      // @ts-ignore
      newObj[key] = item;
    }
    this.update(newObj, 'addAfter');
    return this
  }

  override addBefore(item: any, key?: any) {
    if (key === undefined) {
      throw new Error('you must define a key to addAfter an item for an object collection');
    }
    const temp = {}

    let put = false;
    this.forEach((fItem, fKey: string) => {
      if ((!put) && !this.compKeys(key, fKey)) {
        // @ts-ignore
        temp[key] = item;
      }
      // @ts-ignore
      temp[fkey] = fItem;
    });
    this.update(temp, 'addBefore');
    return this;
  }
}
