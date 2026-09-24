import { createTestMatch } from './create-test-match.js';

describe('createTestMatch', () => {
  describe('negative cases', () => {
    it('returns no patterns when no source folders are given', () => {
      expect(createTestMatch([], 'spec')).toEqual([]);
    });
  });

  describe('positive cases', () => {
    it('builds a pattern for a single source folder', () => {
      expect(createTestMatch(['./src'], '(spec|test)')).toEqual(['<rootDir>./src/**/*.(spec|test).{js,jsx,ts,tsx}']);
    });

    it('builds one pattern per source folder with the given prefix', () => {
      expect(createTestMatch(['./src', './lib'], '(spec|test)')).toEqual([
        '<rootDir>./src/**/*.(spec|test).{js,jsx,ts,tsx}',
        '<rootDir>./lib/**/*.(spec|test).{js,jsx,ts,tsx}',
      ]);
    });

    it('uses a custom prefix', () => {
      expect(createTestMatch(['./src'], 'e2e')).toEqual(['<rootDir>./src/**/*.e2e.{js,jsx,ts,tsx}']);
    });
  });
});
