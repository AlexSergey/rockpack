import { isRecord, isString } from './guards.js';

describe('guards', () => {
  describe('negative cases', () => {
    it('rejects values that are not plain objects', () => {
      expect([null, undefined, [], new Date(), 'text', 1, (): void => undefined].some((value) => isRecord(value))).toBe(
        false,
      );
    });

    it('rejects values that are not strings', () => {
      expect([null, undefined, 1, {}, [], new String('boxed')].some((value) => isString(value))).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('accepts plain objects, including ones without a prototype', () => {
      expect([{}, { a: 1 }, Object.create(null) as object].every((value) => isRecord(value))).toBe(true);
    });

    it('accepts strings, including the empty one', () => {
      expect(['', 'text'].every((value) => isString(value))).toBe(true);
    });
  });
});
