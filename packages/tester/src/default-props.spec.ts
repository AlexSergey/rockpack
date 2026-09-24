import { defaultProps } from './default-props.js';

describe('defaultProps', () => {
  describe('negative cases', () => {
    it('does not enable watch mode', () => {
      expect(defaultProps.watch).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('matches spec and test files under ./src', () => {
      expect(defaultProps).toEqual({ prefix: '(spec|test)', src: './src', watch: false });
    });
  });
});
