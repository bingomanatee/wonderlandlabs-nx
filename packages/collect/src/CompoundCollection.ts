import Collection from './Collection';
import Stopper from './utils/Stopper';
import Match from './utils/Match';
import type {
  filterAction,
  iteratorMethods,
  reduceAction,
  collectionObj,
  optionsObj,
} from './types';
import { ABSENT } from "./constants.export";

export default abstract class CompoundCollection extends Collection {
  get size() {
    return this.store.size;
  }

  get keys(): any[] {
    return this.store.keys();
  }

  get items(): any[] {
    return this.store.values();
  }

  hasItem(item: any) {
    return Array.from(this.items).some((storeItem) => (
      Match.sameItem(storeItem, item, this)
    ));
  }

  hasKey(key: any) {
    if (this.store.has(key)) {
      return true;
    }
    const iter = this.keyIter();
    let done = false;
    do {
      const iterValue = iter.next();
      done = !!iterValue.done;
      if (done) {
        break;
      }
      const storeKey = iterValue.value;
      if (Match.sameKey(storeKey, key, this)) {
        return true;
      }
    } while (!done);

    return false;
  }

  set(key: any, item: any) {
    let done = false;
    const iter = this.keyIter();
    do {
      const iterValue = iter.next();
      done = !!iterValue.done;
      if (done) {
        break;
      }
      const storeKey = iterValue.value;
      if (Match.sameKey(storeKey, key, this)) {
        this.store.set(storeKey, item);
        return this;
      }
    } while (!done);
    this.store.set(key, item);
    return this;
  }

  get(key: any) {
    return this.reduce((found, item, itemKey, _store, stopper) => {
      if (Match.sameKey(itemKey, key, this)) {
        stopper.final();
        return item;
      }
      return found;
    }, undefined);
  }

  keyOf(item: any): any | undefined {
    const index = this.items.indexOf(item);
    if (index === -1) {
      return undefined;
    }
    return index;
  }

  deleteKey(key: any) {
    this.store.delete(key);
    return this;
  }

  deleteItem(item: any | any[]) {
    return this.filter((oItem) => !Match.sameItem(oItem, item, this));
  }

  clear() {
    this.store.clear();
    return this;
  }

  filter(filterTest: filterAction) {
    const tempC = this.cloneEmpty();

    const stopper = new Stopper();

    const iter = this.storeIter();

    let done = false;
    do {
      const iterValue = iter.next();
      done = !!iterValue.done;
      if (done) {
        break;
      }
      const [key, item] = iterValue.value;
      const use = filterTest(item, key, this.store, stopper);
      if (stopper.isStopped) {
        break;
      }
      if (use) {
        tempC.set(key, item);
      }
      if (stopper.isLast) {
        break;
      }
    } while (!done);

    this.update(tempC.store, 'filter', filterTest);
    return this;
  }

  forEach(loop: iteratorMethods) {
    const stopper = new Stopper();
    const iter = this.storeIter();
    let done = false;
    while (!done) {
      const iterValue = iter.next();
      done = !!iterValue.done;
      if (done) {
        break;
      }
      const [key, item] = iterValue.value;
      loop(item, key, this.store, stopper);
      if (stopper.isComplete) {
        break;
      }
    }

    return this;
  }

  abstract clone(newOptions?: optionsObj): collectionObj<any, any, any>;
  abstract cloneShallow(newOptions?: optionsObj): collectionObj<any, any, any>;
  abstract cloneEmpty(options?: optionsObj): collectionObj<any, any, any>

  map(loop: iteratorMethods) {
    const stopper = new Stopper();
    const iter = this.storeIter();

    const nextMapCollection = this.cloneEmpty({ quiet: true });

    let done = false;
    while (!done) {
      const iterValue = iter.next();
      done = !!iterValue.done;
      if (done) {
        break;
      }
      const [key, keyItem] = iterValue.value;
      const newItem = loop(keyItem, key, this.store, stopper);
      if (stopper.isComplete) {
        break;
      }
      nextMapCollection.set(key, newItem);
      if (stopper.isComplete) {
        break;
      }
    }
    this.update(nextMapCollection.store, 'map', loop);

    return this;
  }

  reduce(looper: reduceAction, initial?: any) {
    const stopper = new Stopper();

    let out = initial;
    const iter = this.storeIter();
    let done = false;
    while (!done) {
      const iterValue = iter.next();
      done = !!iterValue.done;
      if (done) {
        break;
      }
      const [key, item] = iterValue.value;
      const next = looper(out, item, key, this.store, stopper);
      if (stopper.isStopped) {
        return out;
      }
      out = next;
      if (stopper.isComplete) {
        return next;
      }
    }

    return out;
  }

  // append

  // assume that adding a value by key adds to the end of the item
  addAfter(item: any, key: any = ABSENT) {
    if (key === ABSENT) {
      throw new Error('you must define a key to addAfter an item for a compound collection');
    }
    this.set(key, item);
    return this
  }

  addBefore(item: any, key: any = ABSENT) {
    if (key === ABSENT) {
      throw new Error('you must define a key to addAfter an item for a compound collection');
    }
    const temp = this.cloneEmpty({ quiet: true });
    temp.set(key, item);
    this.forEach((fItem, fKey) => {
      if (!this.compKeys(key, fKey)) {
        temp.set(fKey, fItem);
      }
    });
    this.update(temp.store, 'addBefore');
    return this;
  }

  reduceC(action: reduceAction, start: any) {
    const value = this.reduce(action, start);
    return Collection.create(value);
  }

  removeFirst() {
    const key = this.keys.shift();
    const item = this.get(key);
    this.deleteKey(key);
    return item;
  }

  removeLast() {
    const key = this.keys.pop();
    const item = this.get(key);
    this.deleteKey(key);
    return item;
  }

  // iterators

  abstract keyIter(fromIter?: boolean): IterableIterator<any>;

  abstract itemIter(fromIter?: boolean): IterableIterator<any>;

  abstract storeIter(fromIter?: boolean): IterableIterator<any>;

  // first, last

  first(count: number = 0) {
    if (count < 0) throw new Error('first requires whole number');
    return this.items.slice(0, count + 1);
  }

  last(count: number = 0) {
    if (count < 0) throw new Error('first requires whole number');
    return this.items.slice(-(count + 1));
  }
}
