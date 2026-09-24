import type { Mode } from '../types.js';

import { makeDevtool } from './make-devtool.js';

describe('makeDevtool', () => {
  describe('negative cases', () => {
    it('falls back to inline source maps for an unknown mode', () => {
      expect(makeDevtool('test' as Mode)).toBe('inline-source-map');
    });
  });

  describe('positive cases', () => {
    it.each([
      ['development', 'eval-source-map'],
      ['production', 'hidden-source-map'],
    ] as const)('uses %s source maps as %s', (mode, devtool) => {
      expect(makeDevtool(mode)).toBe(devtool);
    });
  });
});
