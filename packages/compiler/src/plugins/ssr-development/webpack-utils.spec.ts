import path from 'node:path';

import { getOutputFileMeta } from './webpack-utils.js';

describe('getOutputFileMeta', () => {
  describe('negative cases', () => {
    it('points at the output folder when no js asset was emitted', () => {
      expect(getOutputFileMeta({ assets: { 'index.css': {} } }, path.resolve('dist'))).toBe('dist');
    });
  });

  describe('positive cases', () => {
    it('returns the first js asset relative to the working directory', () => {
      const assets = { 'index.css': {}, 'index.js': {}, 'vendor.js': {} };

      expect(getOutputFileMeta({ assets }, path.resolve('dist'))).toBe(path.join('dist', 'index.js'));
    });
  });
});
