import { isRecord } from '@rockpack/utils';
import deepExtend from 'deep-extend';

type CollectionEntry = unknown;

// Entries may be factories that build the plugin or rule from its props.
const isFactory = (entry: unknown): entry is (props: unknown) => unknown => typeof entry === 'function';

type CollectionOpts = {
  data: Record<string, CollectionEntry>;
  props: Record<string, unknown>;
};

export class Collection {
  dict: Record<string, unknown>;
  private __tempData: Record<string, unknown>;
  private readonly _data: Record<string, CollectionEntry>;
  private readonly _props: Record<string, unknown>;

  constructor(opt: CollectionOpts) {
    this._data = opt.data;
    this._props = opt.props;
    this.__tempData = {};

    this.dict = Object.keys(this._data).reduce<Record<string, unknown>>((acc, plName) => {
      const entry = this._data[plName];
      const props = this._props[plName];

      if (isFactory(entry)) {
        const d = entry(props);
        if (Array.isArray(d)) {
          d.forEach((_d, index) => {
            this.__tempData[`${plName}${index}`] = _d;
          });
        } else {
          acc[plName] = d;
        }
      } else if (isRecord(entry)) {
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

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- public API: callers name the item type
  modify<T extends object = object>(name: string, cb: (item: T) => void): void {
    if (!this.dict[name]) {
      throw new Error(`Provided name "${name}" was not found in the collection`);
    }
    if (typeof cb !== 'function') {
      throw new Error('The second argument should be a function');
    }
    cb(this.dict[name] as T);
  }

  remove(name: string | string[]): void {
    if (Array.isArray(name)) {
      name.forEach((n) => {
        delete this.dict[n];
      });

      return;
    }
    delete this.dict[name];
  }

  set(name: string, data: unknown): void {
    this.dict[name] = data;
  }
}
