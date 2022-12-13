import type {
  collectionObj,
  optionsObj,
  filterAction,
  iteratorMethods,
  orderingFn,
  reduceAction, comparatorFn
} from "../types";
import { clone } from './change';

export default class StandInCollection implements collectionObj<any, any, any> {
  compItems = (a: any, b: any) => a === b;

  compKeys = (a: any, b: any) => a === b;

  withComp(fn: () => any, options: optionsObj): any {
    return fn();
  }

  public quiet = false;

  constructor(store: any, options?: optionsObj) {
    this.store = store;
    if (options?.compKeys) {
      this.compKeys = options?.compKeys;
    }
    if (options?.compItems) {
      this.compItems = options?.compItems;
    }
    this.quiet = !!options?.quiet;
  }

  clear(): collectionObj<any, any, any> {
    return this;
  }

  clone(newOptions?: optionsObj): collectionObj<any, any, any> {
    return new StandInCollection(clone(this.store), newOptions);
  }

  cloneShallow(newOptions?: optionsObj) {
    return new StandInCollection(clone(this.store), newOptions);
  }

  cloneEmpty() {
    return this
  }

  get c() {
    return this.clone();
  }

  deleteKey(_key: any): collectionObj<any, any, any> {
    return this;
  }

  deleteItem(_key: any): collectionObj<any, any, any> {
    return this;
  }

  filter(_action: filterAction): collectionObj<any, any, any> {
    return this;
  }

  forEach(_action: iteratorMethods): collectionObj<any, any, any> {
    return this;
  }

  form = 'object';

  get(_key: any): any {
    return null;
  }

  hasItem(_item: any): boolean {
    return false;
  }

  hasKey(_key: any): boolean {
    return false;
  }

  items: any[] = [];

  keyOf(_item: any): any {
    return undefined;
  }

  keys: any[] = [];

  map(_action: iteratorMethods): collectionObj<any, any, any> {
    return this;
  }

  reduce(_action: reduceAction, _initial: any): any {
    return null;
  }

  reduceC(_action: reduceAction, _initial: any): collectionObj<any, any, any> {
    return this;
  }

  set(_key: any, _value: any): collectionObj<any, any, any> {
    return this;
  }

  size = 0;

  sort(_sorter: orderingFn | undefined): collectionObj<any, any, any> {
    return this;
  }

  change(newStore: any): collectionObj<any, any, any> {
    this.store = newStore;
    return this;
  }

  store: any;

  type = 'object';

  // iterators

  keyIter(): IterableIterator<any> {
    return this.keys[Symbol.iterator]();
  }

  itemIter(): IterableIterator<any> {
    return this.items[Symbol.iterator]();
  }

  storeIter() {
    return this.store[Symbol.iterator]();
  }
  // prepend/append

  addAfter(_item: any, _key?: number) : collectionObj<any, any, any> {
    return this;
  }

  addBefore(_item: any, _key?: number) : collectionObj<any, any, any> {
    return this;
  }

  first(_count: number = 0): any[] {
    return [];
  }
  last(_count: number = 0): any[] {
    return [];
  }

  get firstItem() {
    return undefined;
  }

  get lastItem() {
    return undefined;
  }

  removeLast(_count?: number) {
    return this;
  }

  removeFirst(_count?: number) {
    return this;
  }
}
