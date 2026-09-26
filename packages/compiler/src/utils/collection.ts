// Named webpack rules or plugins that a compiler callback can read and change before the config is built.
export class Collection<T> {
  readonly dict: Record<string, T>;

  constructor(entries: Readonly<Record<string, T>>) {
    this.dict = { ...entries };
  }

  add(name: string, instance: T): void {
    this.dict[name] = instance;
  }

  get(name?: string): T[] {
    if (name !== undefined) {
      const entry = this.dict[name];

      return entry === undefined ? [] : [entry];
    }

    return Object.values(this.dict);
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- public API: callers name the item type
  modify<U extends T = T>(name: string, cb: (item: U) => void): void {
    const entry = this.dict[name];
    if (entry === undefined) {
      throw new Error(`Provided name "${name}" was not found in the collection`);
    }
    if (typeof cb !== 'function') {
      throw new TypeError('The second argument should be a function');
    }
    cb(entry as U);
  }

  remove(name: string | string[]): void {
    for (const key of Array.isArray(name) ? name : [name]) {
      delete this.dict[key];
    }
  }

  set(name: string, data: T): void {
    this.dict[name] = data;
  }
}
