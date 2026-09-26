import { makeDevtool } from './make-devtool.js';

describe('makeDevtool', () => {
  describe('negative cases', () => {
    it('keeps production source maps out of the bundle', () => {
      expect(makeDevtool('production')).toBe('hidden-source-map');
    });
  });

  describe('positive cases', () => {
    it('evaluates source maps in development', () => {
      expect(makeDevtool('development')).toBe('eval-source-map');
    });
  });
});
