import { readTestPathPatterns } from './read-test-path-patterns.js';

describe('readTestPathPatterns', () => {
  describe('negative cases', () => {
    it('returns no patterns without arguments', () => {
      expect(readTestPathPatterns([])).toEqual([]);
    });

    it('skips flags and the values of flags that take one', () => {
      expect(
        readTestPathPatterns([
          '--watch',
          '--mode',
          'test',
          '--testNamePattern',
          'renders',
          '-t',
          'loads',
          '--config',
          'jest.config.json',
          '-c',
          'other.json',
        ]),
      ).toEqual([]);
    });

    it('skips flags written with an equals sign', () => {
      expect(readTestPathPatterns(['--mode=test', '--testNamePattern=renders'])).toEqual([]);
    });
  });

  describe('positive cases', () => {
    it('turns positional arguments into patterns', () => {
      expect(readTestPathPatterns(['cli', 'generation'])).toEqual(['cli', 'generation']);
    });

    it('keeps an argument after a boolean flag', () => {
      expect(readTestPathPatterns(['--watch', 'cli'])).toEqual(['cli']);
    });

    it('keeps the arguments around a flag value', () => {
      expect(readTestPathPatterns(['cli', '--mode', 'test', 'generation'])).toEqual(['cli', 'generation']);
    });
  });
});
