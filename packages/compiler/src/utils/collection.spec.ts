import { Collection } from './collection.js';

const createCollection = (): Collection =>
  new Collection({
    data: {
      array: (): string[] => ['first', 'second'],
      factory: (props: unknown): unknown => ({ created: props }),
      object: { a: 1, nested: { b: 2 } },
      primitive: 'ignored',
    },
    props: {
      factory: { option: true },
      object: { nested: { c: 3 } },
    },
  });

describe('Collection', () => {
  describe('negative cases', () => {
    it('skips primitive entries', () => {
      expect(createCollection().dict).not.toHaveProperty('primitive');
    });

    it('throws when modifying a missing name', () => {
      expect(() => createCollection().modify('missing', () => {})).toThrow(
        'Provided name "missing" was not found in the collection',
      );
    });

    it('throws when the modify callback is not a function', () => {
      expect(() => createCollection().modify('object', 'callback' as unknown as () => void)).toThrow(
        'The second argument should be a function',
      );
    });
  });

  describe('positive cases', () => {
    it('calls function entries with their props', () => {
      expect(createCollection().dict['factory']).toEqual({ created: { option: true } });
    });

    it('spreads array results into indexed entries after the others', () => {
      expect(Object.keys(createCollection().dict)).toEqual(['factory', 'object', 'array0', 'array1']);
      expect(createCollection().get('array1')).toEqual(['second']);
    });

    it('deep-merges props into object entries', () => {
      expect(createCollection().dict['object']).toEqual({ a: 1, nested: { b: 2, c: 3 } });
    });

    it('returns every entry or a single one', () => {
      const collection = createCollection();

      expect(collection.get()).toHaveLength(4);
      expect(collection.get('factory')).toEqual([{ created: { option: true } }]);
    });

    it('adds, sets and modifies entries', () => {
      const collection = createCollection();

      collection.add('added', { value: 1 });
      collection.set('set', { value: 2 });
      collection.modify<{ value: number }>('added', (item) => {
        item.value = 10;
      });

      expect(collection.get('added')).toEqual([{ value: 10 }]);
      expect(collection.get('set')).toEqual([{ value: 2 }]);
    });

    it('removes one or several entries', () => {
      const collection = createCollection();

      collection.remove('factory');
      collection.remove(['array0', 'array1']);

      expect(Object.keys(collection.dict)).toEqual(['object']);
    });
  });
});
