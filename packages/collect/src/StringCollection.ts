import type {
  collectionObj,
  optionsObj,
  filterAction,
  orderingFn
} from './types';
import IntIndexedCollection from './IntIndexedCollection';
import Match from './utils/Match';
import Stopper from './utils/Stopper';
import Collection from './Collection';
import { booleanMode } from "./constants";

export default class StringCollection extends IntIndexedCollection
  implements collectionObj<string, number, string> {
  constructor(store: string, options?: optionsObj) {
    super(store, options);
    this._store = store;
  }

  // region inspection
  get size() {
    return this.store.length;
  }

  get items() {
    return this.store.split('');
  }

  hasItem(str: { test: (arg0: any) => any; }) {
    if (str instanceof RegExp) {
      return str.test(this.store);
    }
    return this.store.includes(str);
  }

  hasKey(i: number) {
    if (i % 1) {
      return false;
    }
    return i >= 0 && i < this.size;
  }

  keyOf(item: string) {
    const indexOf = this.store.indexOf(item);
    if (indexOf === -1) {
      return undefined;
    }
    return indexOf;
  }

  // endregion

  // region changes

  /**
   * acts like array.splice; inserts a string into/over part of the item;
   * @param key
   * @param item
   */
  set(key: number, item: string) {
    const prefix = this.store.substring(0, key) || '';
    const suffix = this.store.substring(key + Math.max(item.length, 1)) || '';
    this.update(prefix + item + suffix, 'set', key, item);
    return this;
  }

  get(key: number) {
    if (key < 0 || key > this.size) {
      return undefined;
    }
    return this.store.substring(key, key + 1);
  }

  deleteKey(key: number | Array<number>) {
    if (Array.isArray(key)) {
      return this.filter((_item, itemKey) => !Match.sameKey(itemKey, key, this));
    }
    return this.set(key, '');
  }

  deleteItem(
    item: Array<string> | string
  ): collectionObj<string, number, string> {
    if (Array.isArray(item)) {
      const cloned = this.clone({ quiet: true });
      cloned.filter((otherItem) => !Match.sameItem(otherItem, item, this));
      this.update(cloned.store, 'deleteItem', item);
    }
    let newStore: string = this.store;
    let length = newStore.length;
    do {
      length = newStore.length;
      newStore = newStore.replace(item as string, '');
    } while (newStore && newStore.length < length);

    this.update(newStore, 'deleteItem', item);
    return this;
  }

  clear() {
    this.update('', 'clear');
    return this;
  }

  reverse(): collectionObj<string, number, string> {
    return new StringCollection(this.items.reverse().join(''));
  }

  // note - this is the one version of sort where the item types are known to be 1-char strings
  // so the default array sort works fine as a default
  sort(sort?: orderingFn): collectionObj<string, number, string> {
    const letters = Collection.create(
      this.store.split(''),
      this.mergeOptions({ quiet: true })
    );
    letters.sort(this.sorter(sort));
    this.update(letters.store.join(''), 'sort', sort);
    return this;
  }

  // endregion

  // region iteration

  // endregion

  // region duplication

  clone(options?: optionsObj) {
    return new StringCollection(this.store, this.mergeOptions(options));
  }

  cloneShallow(newOptions?: optionsObj) {
    return new StringCollection(this.store, this.mergeOptions(newOptions));
  }

  cloneEmpty(opts?: optionsObj) {
    return new StringCollection('', this.mergeOptions(opts));
  }

  filter(filterTest: filterAction) {
    const newStore = this.reduce((memo, letter, key, _original, stopper) => {
      const use = filterTest(letter, key, this.store, stopper);
      if (use && stopper.isActive) {
        return `${memo}${letter}`;
      }
      return memo;
    }, '');

    this.update(newStore, 'filter', filterTest);
    return this;
  }

  // endregion

  // region boolean

  difference(
    itemsToRemove: collectionObj<any, any, any> | string | string[],
    _mode: booleanMode = booleanMode.byKey
  ): collectionObj<string, number, string> {
    if (typeof itemsToRemove === 'string' || Array.isArray(itemsToRemove)) {
      const next = new StringCollection(this.store);
      next.deleteItem(itemsToRemove);
      return next;
    }
    return this.difference(itemsToRemove.store);
  }

  union(
    other: collectionObj<any, any, any> | string | string[],
    _mode: booleanMode = booleanMode.byKey
  ): collectionObj<string, number, string> {
    if (typeof other === 'string') {
      return this.union(other.split(''));
    }
    if (Array.isArray(other)) {
      const chars = [...this.items, ...other];
      const unique: string = chars.reduce((memo, char: string) => {
        if (memo.includes(char)) {
          return memo;
        }
        return memo + char;
      }, '');
      return new StringCollection(unique);
    }
    return this.union(other.store);
  }

  map(looper) {
    const stopper = new Stopper();
    const newStore: string[] = [];
    const iter = this.storeIter();

    let done = false;
    do {
      const iterValue = iter.next();
      done = iterValue.done;
      if (done) {
        break;
      }
      const [key, keyItem] = iter.value;
      const item = looper(keyItem, key, this._store, stopper);
      if (stopper.isStopped) {
        break;
      }
      newStore.push(item);
      if (stopper.isComplete) {
        break;
      }
    } while (!done);

    this.update(newStore.join(''), 'map', looper);
    return this;
  }

  intersection(
    other: collectionObj<any, any, any> | string | string[]
  ): collectionObj<string, number, string> {
    if (typeof other === 'string') {
      return this.intersection(other.split(''));
    }
    if (Array.isArray(other)) {
      const unique: string[] = this.items.filter((char) => other.includes(char));
      return new StringCollection(unique.join(''));
    }
    return this.intersection(other.items);
  }

  // endregion

  override storeIter() {
    return this.items.entries();
  }

  override keyIter() {
    return this.keys[Symbol.iterator]();
  }

  override itemIter() {
    return this.items[Symbol.iterator]();
  }

  // append/prepend

  addAfter(item, _key?: number | undefined) {
    this.update(`${this.store}${item}`, 'addBefore');
    return this;
  }

  addBefore(item, _key?: number | undefined) {
    this.update(`${item}${this.store}`, 'addBefore');
    return this;
  }

  removeFirst() {
    const item = this.store.substring(0, 1);
    const rest = this.store.substring(1);
    this.update(rest, 'removeFirst');
    return item;
  }

  removeLast() {
    const item = this.store.substring(this.size - 1);
    const rest = this.store.substring(0, this.size - 1);
    this.update(rest, 'removeLast');
    return item;
  }

  // first, last

  override first(count: number = 0): string[] {
    if (count < 0) throw new Error('first requires whole number');
    return this.items.substring(0, count + 1);
  }

  override last(count: number = 0) {
    if (count < 0) throw new Error('last requires whole number');
    return Collection.create(this.items).last(count);
  }
}
