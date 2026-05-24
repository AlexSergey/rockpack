import deepExtend from 'deep-extend';

import { isArray, isFunction, isObject } from './valid-types-compat.js';

type CollectionEntry = unknown;

interface CollectionOpts {
  data: Record<string, CollectionEntry>;
  props: Record<string, unknown>;
}

export class Collection {
  dict: Record<string, unknown>;
  private __tempData: Record<string, unknown>;
  private _data: Record<string, CollectionEntry>;
  private _props: Record<string, unknown>;

  constructor(opt: CollectionOpts) {
    this._data = opt.data;
    this._props = opt.props;
    this.__tempData = {};

    this.dict = Object.keys(this._data).reduce<Record<string, unknown>>((acc, plName) => {
      const entry = this._data[plName];
      const props = this._props[plName];

      if (isFunction(entry)) {
        const d = (entry as (p: unknown) => unknown)(props);
        if (isArray(d)) {
          (d as unknown[]).forEach((_d, index) => {
            this.__tempData[`${plName}${index}`] = _d;
          });
        } else {
          acc[plName] = d;
        }
      } else if (isObject(entry)) {
        acc[plName] = deepExtend(entry as object, props as object);
      }

      return acc;
    }, {});

    Object.keys(this.__tempData).forEach((key) => {
      this.dict[key] = this.__tempData[key];
    });
  }

  add(name: string, instance: unknown): void {
    this.dict[name] = instance;
  }

  get(name?: string): unknown[] {
    if (name) {
      return [this.dict[name]];
    }

    return Object.keys(this.dict).map((n) => this.dict[n]);
  }

  modify(name: string, cb: (item: unknown) => void): void {
    if (!this.dict[name]) {
      throw new Error(`Provided name "${name}" was not found in the collection`);
    }
    if (!isFunction(cb)) {
      throw new Error('The second argument should be a function');
    }
    cb(this.dict[name]);
  }

  remove(name: string | string[]): void {
    if (isArray(name)) {
      (name as string[]).forEach((n) => {
        delete this.dict[n];
      });

      return;
    }
    delete this.dict[name as string];
  }

  set(name: string, data: unknown): void {
    this.dict[name] = data;
  }
}
