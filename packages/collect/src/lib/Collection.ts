/* eslint-disable @typescript-eslint/no-unused-vars */
import { type } from "@wonderlandlabs/walrus";
import type {
  optionsObj,
  comparatorFn,
  onChangeFn,
  orderingFn, collectionObj,
} from './types';
import {
  e,
  isFn
} from './utils/tests';
import { clone } from './utils/change';
import StandinCollection from './utils/StandinCollection';

const simpleComparator = (a: any, b: any) => a === b;

// note - Collection is NOT compatible with the full collectionObj signature
export default abstract class Collection {
  constructor(_store: any, options?: optionsObj) {
    // note - does NOT set store, as that should be done at the implementor level, for type reasons
    if (options?.compKeys) {
      this.compKeys = options?.compKeys || simpleComparator;
    }
    if (options?.compItems) {
      this.compItems = options?.compItems || simpleComparator;
    }
    this.quiet = !!options?.quiet;
  }

  public onChange?: onChangeFn;

  change(newStore: any): collectionObj<any, any, any> {
    if (typeof newStore === 'function') {
      try {
        const cloned = clone(this.store);
        let updated = newStore(cloned);
        if (updated === undefined) {
          updated = cloned;
        }

        if (updated === newStore) {
          throw e('circular change', { newStore, target: this });
        }

        return this.change(updated);
      } catch (err) {
        throw e('functional newStore throws error:', {
          err,
          newStore,
          target: this
        });
      }
    }
    const newType = type.describe(newStore, true);
    if ((newType as string) !== this.type) {
      throw e('attempt to setStore different type than exists now', {
        target: this,
        newStore,
        type: newType
      });
    }
    return this.update(newStore, 'change');
  }

  protected update(newStore: any, source?: string, ...input: any[]): collectionObj<any, any, any> {
    try {
      if (!this.quiet && this.onChange && source) {
        this.onChange(newStore, source, input);
      }
    } catch (err) {
      console.warn('update: onChange error', err);
      // @ts-ignore
      return this;
    }
    this._store = newStore;
    // @ts-ignore
    return this;
  }

  protected sorter(sortFn?: orderingFn) {
    return sortFn ? (a: any, b: any) => sortFn(a, b, this) : undefined;
  }

  get store(): any {
    return this._store;
  }

  protected _store: any;

  abstract get size(): number;

  abstract get keys(): number[];

  abstract get items(): any[];

  // options and comparator

  mergeOptions(mergeOptions?: optionsObj) {
    if (!mergeOptions) {
      return this.options;
    }
    return { ...this.options, ...mergeOptions };
  }

  get options() {
    return {
      quiet: this.quiet,
      compKeys: this.compKeys,
      compItems: this.compItems
    };
  }

  public quiet = false;

  protected _compKeys: comparatorFn = simpleComparator;

  get compKeys(): comparatorFn {
    return this._compKeys || simpleComparator;
  }

  set compKeys(value: comparatorFn) {
    if (!isFn(value)) {
      throw e('improper compKeys function', { target: this, fn: value });
    }
    this._compKeys = value;
  }

  protected _compItems: comparatorFn = simpleComparator;

  get compItems(): comparatorFn {
    return this._compItems || simpleComparator;
  }

  set compItems(value: comparatorFn) {
    if (!isFn(value)) {
      throw e('improper compItems function', { target: this, fn: value });
    }
    this._compItems = value;
  }

  get form(): string {
    return type.describe(this._store, 'form') as string;
  }

  get type(): string {
    return type.describe(this._store, true) as string;
  }

  get c() {
    return Collection.create(clone(this._store));
  }

  withComp(action: () => any, comp: optionsObj): any {
    let out = null;

    const { compKeys, compItems } = this;
    try {
      if (comp.compKeys) {
        this.compKeys = comp.compKeys;
      }
      if (comp.compItems) {
        this.compItems = comp.compItems;
      }
      out = action();
    } catch (err) {
      this.compKeys = compKeys;
      this.compItems = compItems;
      throw err;
    }

    return out;
  }

  // must be overridden before any collections are created with a working create method
  static create = (store: any, options?: optionsObj) => (
    new StandinCollection(store, options)
  );

  abstract first(count?: number): any[];

  abstract last(count?: number): any[];

  get firstItem() {
    if (!this.size) {
      return undefined;
    }
    const [item] = this.first();
    return item;
  }

  get lastItem() {
    if (!this.size) {
      return undefined;
    }
    const [item] = this.last();
    return item;
  }
}
