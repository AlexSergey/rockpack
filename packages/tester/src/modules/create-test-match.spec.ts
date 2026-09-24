import { createTestMatch } from './create-test-match.js';

describe('createTestMatch', () => {
  describe('negative cases', () => {
    it('returns no patterns when no source folders are given', () => {
      expect(createTestMatch([], 'spec')).toEqual([]);
    });
  });

  describe('positive cases', () => {
    it('builds one pattern per source folder with the given prefix', () => {
      expect(createTestMatch(['./src', './lib'], '(spec|test)')).toEqual([
        '<rootDir>./src/**/*.(spec|test).{js,jsx,ts,tsx}',
        '<rootDir>./lib/**/*.(spec|test).{js,jsx,ts,tsx}',
      ]);
    });
  });
});
