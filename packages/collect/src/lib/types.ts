import { stopperEnum } from "./constants";

export type StopperObj = {
  state: stopperEnum;
  isActive: boolean;
  isStopped: boolean;
  isComplete: boolean;
  final: () => void;
  stop: () => void;
  stopAfterThis: () => void;
};

export type iteratorMethods = (
  item: any,
  key: keyType,
  store: any,
  stopper: StopperObj
) => any;
export type reduceAction = (
  memo: any,
  item: any,
  key: keyType,
  store: any,
  stopper: StopperObj
) => any;
export type filterAction = (
  item: string,
  key: number,
  store: any,
  stopper: StopperObj
) => boolean;
export type combinerFn = any; // a generator function
export type orderingFn = (item1: any, item2: any, coll?: any) => number;
export type comparatorFn = (k1: any, k2: any) => boolean;

export type onChangeFn = (
  newStore: any,
  source: string,
  input?: any[]
) => any | undefined;

export type keyType = any;

export type someValues = Array<any>;
export type valueType = any;

export type comparatorObj = {
  compKeys?: comparatorFn;
  compItems?: comparatorFn;
};

export type collectionBaseObj<StoreType, KeyType, ItemType> = {
  readonly store: StoreType;
  keys: KeyType[];
  items: ItemType[];

  // reflection
  form: string;
  type: string;
  size: number;
  clone: (options?: optionsObj) => collectionObj<StoreType, KeyType, ItemType>; // new collection with cloned item
  cloneShallow: (options?: optionsObj) => collectionObj<StoreType, KeyType, ItemType>; // new collection shallow clone of store
};

export type collectionIterProvider<_StoreType, KeyType, ItemType> = {
  storeIter: (fromIter?: boolean) => IterableIterator<[KeyType, ItemType]>;
  itemIter: (fromIter?: boolean) => IterableIterator<ItemType>;
  keyIter: (fromIter?: boolean) => IterableIterator<KeyType>;
};

export type optionsObj = { quiet?: boolean } & comparatorObj;
export type collectionBaseIterProvider<StoreType,
  KeyType,
  ItemType> = collectionIterProvider<StoreType, KeyType, ItemType> &
  collectionBaseObj<StoreType, KeyType, ItemType> &
  optionsObj;

export type changeObserver = (
  pendingStore: any,
  action: string,
  opts?: any
) => any;

export type collectionObj<StoreType, KeyType, ItemType> = {
  // Reflection
  hasItem: (item: ItemType) => boolean;
  hasKey: (key: KeyType) => boolean;
  keyOf: (item: ItemType) => KeyType | undefined; // the _first_ key of a given item
  // an item may be associated with more than one key -- this is the first one.
  get: (key: KeyType) => any;
  // comparison
  withComp: (action: () => any, config: optionsObj) => any; // performs operations with the given comparators operating, then returns current ones.

  // push, pop

  addAfter: (item: ItemType, key?: KeyType) => collectionObj<StoreType, KeyType, ItemType>; // self
  addBefore: (item: ItemType, key?: KeyType) => collectionObj<StoreType, KeyType, ItemType>; // self
  removeLast: () => any;
  removeFirst: () => any;
  first: (count?: number) => ItemType[];
  last: (count?: number) => ItemType[];
  firstItem: ItemType | undefined;
  lastItem: ItemType | undefined;

  // changes
  change(newValue: any): collectionObj<StoreType, KeyType, ItemType>; // self
  set: (
    key: KeyType,
    value: any
  ) => collectionObj<StoreType, KeyType, ItemType>; // self
  deleteKey: (
    key: KeyType | Array<KeyType>
  ) => collectionObj<StoreType, KeyType, ItemType>; // self
  deleteItem: (
    item: ItemType | Array<ItemType>
  ) => collectionObj<ItemType, KeyType, ItemType>; // self
  clear: () => collectionObj<StoreType, KeyType, ItemType>; // self
  sort: (sorter?: orderingFn) => collectionObj<StoreType, KeyType, ItemType>; // self
  c: collectionObj<StoreType, KeyType, ItemType>; // a property identical to clone; for convenience.brevity
  cloneEmpty: (options?: optionsObj) => collectionObj<ItemType, KeyType, ItemType>; // new, empty version of this;

  // iteration
  forEach: (
    action: iteratorMethods
  ) => collectionObj<StoreType, KeyType, ItemType>; // self
  map: (action: iteratorMethods) => collectionObj<StoreType, KeyType, ItemType>; // mutates properties
  filter: (action: filterAction) => collectionObj<StoreType, KeyType, ItemType>; // a new collection wth some of the values;
  reduce: (action: reduceAction, initial: any) => any; // an arbitrary value, computed by looping over the store
  reduceC: (action: reduceAction, initial: any) => collectionObj<any, any, any>; // a new collection for the output of reduce
  // note : the new collection may not be the same type as the start collection

  // observation
  onChange?: changeObserver;
} & collectionBaseIterProvider<StoreType, KeyType, ItemType>;
