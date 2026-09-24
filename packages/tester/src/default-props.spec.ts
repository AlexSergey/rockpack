import { defaultProps } from './default-props.js';

describe('defaultProps', () => {
  describe('negative cases', () => {
    it('does not enable watch or serial mode', () => {
      expect([defaultProps.watch, defaultProps.serial]).toEqual([false, false]);
    });
  });

  describe('positive cases', () => {
    it('matches spec and test files under ./src', () => {
      expect(defaultProps).toEqual({
        coverage: true,
        prefix: '(spec|test)',
        replaceArrays: false,
        serial: false,
        src: './src',
        testPathPatterns: [],
        watch: false,
      });
    });
  });
});
