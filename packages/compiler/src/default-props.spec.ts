import { defaultProps } from './default-props.js';

describe('defaultProps', () => {
  describe('negative cases', () => {
    it('keeps debug off by default', () => {
      expect(defaultProps.debug).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('defines the default compiler options', () => {
      expect(defaultProps).toEqual({ debug: false, dist: 'dist/index.js', html: true, port: 3000, src: 'src/index' });
    });
  });
});
