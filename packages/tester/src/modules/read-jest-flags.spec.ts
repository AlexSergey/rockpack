import { readJestFlags } from './read-jest-flags.js';

describe('readJestFlags', () => {
  describe('negative cases', () => {
    it('returns no flags without arguments', () => {
      expect(readJestFlags([])).toEqual({});
    });

    it('ignores flags outside the allowlist', () => {
      expect(readJestFlags(['--verbose', '--coverage', '--watch', 'cli'])).toEqual({});
    });

    it('does not take a non-numeric argument after --bail as its value', () => {
      expect(readJestFlags(['--bail', 'cli'])).toEqual({ bail: true });
    });
  });

  describe('positive cases', () => {
    it('reads the test name pattern from -t and --testNamePattern', () => {
      expect(readJestFlags(['-t', 'renders'])).toEqual({ testNamePattern: 'renders' });
      expect(readJestFlags(['--testNamePattern', 'renders'])).toEqual({ testNamePattern: 'renders' });
      expect(readJestFlags(['--testNamePattern=renders'])).toEqual({ testNamePattern: 'renders' });
    });

    it('reads -u and --updateSnapshot', () => {
      expect(readJestFlags(['-u'])).toEqual({ updateSnapshot: true });
      expect(readJestFlags(['--updateSnapshot'])).toEqual({ updateSnapshot: true });
    });

    it('reads --ci', () => {
      expect(readJestFlags(['--ci'])).toEqual({ ci: true });
    });

    it('reads --bail with and without a number', () => {
      expect(readJestFlags(['--bail'])).toEqual({ bail: true });
      expect(readJestFlags(['--bail', '3'])).toEqual({ bail: 3 });
      expect(readJestFlags(['--bail=2'])).toEqual({ bail: 2 });
    });

    it('reads several flags together', () => {
      expect(readJestFlags(['cli', '-t', 'renders', '-u', '--bail', '3', '--ci'])).toEqual({
        bail: 3,
        ci: true,
        testNamePattern: 'renders',
        updateSnapshot: true,
      });
    });
  });
});
