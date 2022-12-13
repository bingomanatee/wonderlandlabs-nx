import Collection from "./Collection";
import type {
  collectionObj,
  optionsObj,
  filterAction,
  orderingFn,
  reduceAction,
  iteratorMethods,
  StopperObj
} from "./types";
import Stopper from "./utils/Stopper";

export default class SetCollection extends Collection
  implements collectionObj<any, any, any> {
  protected override _store: Set<any>;

  constructor(store: any, options?: optionsObj) {
    super(store, options);
    this._store = store as Set<any>;
  }

  clear(): collectionObj<any, any, any> {
    this.update(new Set(), "clear");
    return this;
  }

  clone(options?: optionsObj) {
    return new SetCollection(new Set(this.store), this.mergeOptions(options));
  }

  deleteItem(item: any) {
    const store = new Set(this._store);
    store.delete(item);
    this.update(store, "deleteItem");
    return this;
  }

  deleteKey(key: any) {
    if (Array.isArray(key)) {
      const store = this.reduce((memo, item, rKey) => {
        if (!key.includes(rKey)) {
          memo.add(item);
        }
        return memo;
      }, new Set());
      this.update(store, "deleteKey");
      return this;
    }

    if (this.hasKey(key)) {
      const item = this.get(key);

      const set = new Set(this._store);
      set.delete(item);
      this.update(set, "deleteKey");
    }
    return this;
  }

  add(item: any) {
    const store = new Set(this._store);
    store.add(item);
    return this.update(store, "add");
  }

  filter(action: filterAction) {
    const newSet = new Set(this._store);

    this.forEach((item, key, store, stopper) => {
      const use = action(item, key, store, stopper);
      if (stopper.isActive && use) {
        newSet.add(item);
      }
    });

    this.update(newSet, "filter");
    return this;
  }

  forEach(action: iteratorMethods) {
    const set = this.clone(this.mergeOptions({ quiet: true }));
    const stopper = new Stopper();

    const iter = set.storeIter();
    let done = false;
    do {
      const iterValue = iter.next();
      done = !!iterValue.done;
      if (done) {
        break;
      }
      const [iterKey, iterItem] = iterValue.value;
      action(iterItem, iterKey, this.store, stopper);
      if (!stopper.isActive) {
        break;
      }
    } while (!done);

    return this;
  }

  get(key: any): any {
    if (this.size <= key) {
      return undefined;
    }
    return this.items[key];
  }

  hasItem(item: any): boolean {
    if (this.store.has(item)) {
      return true;
    }
    return this.reduce((memo, value, _key, _store, stopper) => {
      if (this.compItems(value, item)) {
        stopper.final();
        return true;
      }
      return memo;
    }, false);
  }

  hasKey(key: any): boolean {
    return typeof key === "number" && this.size > key;
  }

  itemIter(): IterableIterator<any> {
    return this.store.values();
  }

  keyIter(): IterableIterator<any> {
    const keys: number[] = [];
    for (let i = 0; i < this.size; i += 1) {
      keys.push(i);
    }
    return Collection.create(keys).keyIter();
  }

  keyOf(item: any): any {
    if (!this.hasItem(item)) {
      return undefined;
    }
    return this.reduce((memo, reduceItem, key, _store, stopper) => {
      if (this.compItems(item, reduceItem)) {
        stopper.final();
        return key;
      }
      return memo;
    }, undefined);
  }

  map(action: iteratorMethods) {
    const newItems = new Set();
    this.forEach((item, key, _store, stopper) => {
      const newItem = action(item, key, this.store, stopper);
      if (stopper.isActive) {
        newItems.add(newItem);
      }
    });
    this.update(newItems, "map");
    return this;
  }

  reduce(action: reduceAction, initial: any): any {
    const arrayStore = Collection.create(this.items, this.options);
    const subAction = (memo: any, item: any, key: any, _store: any, stopper: StopperObj) => action(memo, item, key, this.store, stopper);
    return arrayStore.reduce(subAction, initial);
  }

  reduceC(action: reduceAction, initial: any) {
    return this.c.reduce(action, initial);
  }

  set(key: any, item: any) {
    console.warn(
      "set key/value has unpredictable results on a set collection; use add(item) for consistent results"
    );
    if (key > this.size) {
      return this.add(item);
    }
    return this.map((mapItem, mapKey) => {
      if (mapKey === key) {
        return item;
      }
      return mapItem;
    });
  }

  sort(sorter: orderingFn | undefined) {
    const arrayOfItems = Collection.create(this.items, this.options);
    arrayOfItems.sort(sorter);

    this.update(new Set(arrayOfItems.store), "sort");
    return this;
  }

  storeIter(): IterableIterator<any> {
    return Collection.create(this.items).storeIter();
  }

  get items(): any[] {
    return Array.from(this.store.values());
  }

  get keys(): number[] {
    const keys: any[] = [];
    for (let i = 0; i < this.size; i += 1) keys.push(i);
    return keys;
  }

  get size(): number {
    return this.store.size;
  }

  // append/prepend

  addAfter(item: any, _key?: any) {
    let put = false;
    let items = this.items.reduce((list, oldItem) => {
      if ((!put) && !this.compItems(oldItem, item)) {
        put = true;
        return [...list, oldItem, item];
      }
      list.push(oldItem);
      return list;
    }, []);
    if (!put) {
      items.push(item);
    }
    const set = new Set(items);
    this.update(set, "addAfter");
    return this;
  }

  addBefore(item, _key?: any) {
    let put = false;
    let items = this.items.reduce((list, oldItem) => {
      if ((!put) && !this.compItems(oldItem, item)) {
        put = true;
        return [...list, item, oldItem];
      }
      list.push(oldItem);
      return list;
    }, []);
    if (!put) {
      items.unshift(item);
    }
    return this;
  }

  removeFirst() {
    const set = new Set(this.store);
    const item = this.keys.shift();
    set.delete(item);
    this.update(set, "removeFirst");
    return item;
  }

  removeLast() {
    const set = new Set(this.store);
    const item = this.keys.pop();
    set.delete(item);
    this.update(set, "removeFirst");
    return item;
  }

  cloneEmpty(options: optionsObj): collectionObj<any, any, any> {
    return new SetCollection(new Set(), this.mergeOptions(options));
  }

  cloneShallow(newOptions?: optionsObj) {
    return new SetCollection(new Set(this.store), this.mergeOptions(newOptions));
  }

  // first, last

  first(count?: number) {
    return Collection.create(this.items).first(count);
  }

  last(count?: number) {
    return Collection.create(this.items).last(count);
  }
}
