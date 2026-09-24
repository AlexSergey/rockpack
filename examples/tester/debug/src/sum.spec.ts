import { sum } from './sum';

describe('sum', () => {
  describe('negative cases', () => {
    it('does not concatenate the numbers', () => {
      expect(sum(1, 2)).not.toBe(12);
    });
  });

  describe('positive cases', () => {
    it('adds 1 + 2 to equal 3', () => {
      expect(sum(1, 2)).toBe(3);
    });

    it('adds negative numbers', () => {
      expect(sum(-1, -2)).toBe(-3);
    });
  });
});
