import { Collection } from './collection.js';

type Entry = { nested?: { b: number }; value: number };

const createCollection = (): Collection<Entry> =>
  new Collection<Entry>({ first: { value: 1 }, second: { nested: { b: 2 }, value: 2 } });

describe('Collection', () => {
  describe('negative cases', () => {
    it('does not change the entries it was created from', () => {
      const entries = { first: { value: 1 } };
      new Collection<Entry>(entries).set('second', { value: 2 });

      expect(Object.keys(entries)).toEqual(['first']);
    });

    it('returns nothing for a missing name', () => {
      expect(createCollection().get('missing')).toEqual([]);
    });

    it('throws when modifying a missing name', () => {
      expect(() => {
        createCollection().modify('missing', () => undefined);
      }).toThrow('Provided name "missing" was not found in the collection');
    });

    it('throws when the modify callback is not a function', () => {
      expect(() => {
        createCollection().modify('first', 'callback' as unknown as () => void);
      }).toThrow('The second argument should be a function');
    });
  });

  describe('positive cases', () => {
    it('returns every entry in order or a single one', () => {
      const collection = createCollection();

      expect(collection.get()).toEqual([{ value: 1 }, { nested: { b: 2 }, value: 2 }]);
      expect(collection.get('second')).toEqual([{ nested: { b: 2 }, value: 2 }]);
    });

    it('adds, sets and modifies entries', () => {
      const collection = createCollection();

      collection.add('added', { value: 3 });
      collection.set('first', { value: 4 });
      collection.modify('added', (item) => {
        item.value = 10;
      });

      expect(collection.get('added')).toEqual([{ value: 10 }]);
      expect(collection.get('first')).toEqual([{ value: 4 }]);
    });

    it('removes one or several entries', () => {
      const collection = createCollection();
      collection.add('third', { value: 3 });

      collection.remove('first');
      collection.remove(['second']);

      expect(Object.keys(collection.dict)).toEqual(['third']);
    });
  });
});
