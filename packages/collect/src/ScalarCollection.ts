import Collection from './Collection';
import { collectionObj, optionsObj, iteratorMethods, filterAction, reduceAction, orderingFn } from './types';
import { clone } from './utils';

export default class ScalarCollection extends Collection implements collectionObj<any, any, any> {
  protected override _store: any;

  constructor(store: any, options?: optionsObj) {
    super(store, options);
    this._store = store;
  }

  get size() {
    return 0;
  }

  get(_key: any) {
    ScalarCollection.err('key');
    return 0;
  }

  set(_key: any, _item: any) {
    ScalarCollection.err('set');
    return this;
  }

  hasKey(_item: any) {
    ScalarCollection.err('hasKey');
    return false;
  }

  hasItem(_item: any) {
    ScalarCollection.err('hasItem');
    return false;
  }

  keyOf(_item:any) {
    ScalarCollection.err('keyOf');
    return undefined;
  }

  static err(method: string) {
    throw new Error(`${method} not available for scalar collection`);
  }

  get keys() {
    ScalarCollection.err('keys');
    return [];
  }

  get items() {
    ScalarCollection.err('items');
    return [];
  }

  deleteKey(_key: string) {
    ScalarCollection.err('delete');
    return this;
  }

  clear() {
    this.update(undefined, 'clear');
    return this;
  }

  forEach(_action: iteratorMethods) {
    ScalarCollection.err('forEach');
    return this;
  }

  map(_action: iteratorMethods) {
    ScalarCollection.err('map');
    return this;
  }

  reduce() {
    ScalarCollection.err('reduce');
    return null;
  }

  appendBefore(_item: any, _key?: any) {
    ScalarCollection.err('reduce');
    return null;
  }

  appendAfter(_item: any, _key?: any) {
    ScalarCollection.err('reduce');
    return null;
  }

  addAfter(_item: any, _key?: any): collectionObj<any, any, any> {
    ScalarCollection.err('addAfter');
    return this;
  }

  removeLast(_count?: number) {
    ScalarCollection.err('removeLast');
    return this;
  }

  removeFirst(_count?: number) {
    ScalarCollection.err('removeFirst');
    return this;
  }

  addBefore(_item: any, _key: any): collectionObj<any, any, any> {
    ScalarCollection.err('addAfter');
    return this;
  }

  clone(opts?: optionsObj): collectionObj<any, any, any> {
    return new ScalarCollection(clone(this.store), this.mergeOptions(opts));
  }

  cloneShallow(newOptions?: optionsObj) {
    return new ScalarCollection(this.store, this.mergeOptions(newOptions));
  }

  cloneEmpty(opts?: optionsObj) {
    return new ScalarCollection(undefined, this.mergeOptions(opts));
  }

  deleteItem(_item: any): collectionObj<any, any, any> {
    ScalarCollection.err('deleteItem');
    return this;
  }

  filter(_action: filterAction): collectionObj<any, any, any> {
    ScalarCollection.err('filter');
    return this;
  }

  itemIter(_fromIter?: boolean): IterableIterator<any> {
    ScalarCollection.err('itemIter');
    return [].entries()
  }

  keyIter(_fromIter?: boolean): IterableIterator<any> {
    ScalarCollection.err('keyIter');
    return [].entries()
  }

  reduceC(_action: reduceAction, _initial: any): collectionObj<any, any, any> {
    ScalarCollection.err('reduceC');
    return this;
  }

  sort(_sorter: orderingFn | undefined): collectionObj<any, any, any> {
    ScalarCollection.err('sort');
    return this;
  }

  storeIter(_fromIter?: boolean): IterableIterator<[any, any]> {
    ScalarCollection.err('keyIter');
    return [].entries()
  }

  first(_count?: number) {
    ScalarCollection.err('first');
    return [];
  }

  last(_count?: number) {
    ScalarCollection.err('last');
    return [];
  }


}
