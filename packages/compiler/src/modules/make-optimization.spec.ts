import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

import type { Mode } from '../types.js';

import { makeOptimization } from './make-optimization.js';

jest.mock('css-minimizer-webpack-plugin', () => jest.fn());
jest.mock('image-minimizer-webpack-plugin', () => Object.assign(jest.fn(), { sharpMinify: 'sharpMinify' }));
jest.mock('terser-webpack-plugin', () => jest.fn());

const terserMock = TerserPlugin as unknown as jest.Mock;
const imageMinimizerMock = ImageMinimizerPlugin as unknown as jest.Mock;
const cssMinimizerMock = CssMinimizerPlugin as unknown as jest.Mock;

const vendorCacheGroups = {
  defaultVendors: { chunks: 'initial', enforce: true, name: 'vendor', test: 'vendor' },
};

describe('makeOptimization', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('does not minimize in development', () => {
      expect(makeOptimization('development', {})).toMatchObject({ minimize: false, moduleIds: 'named' });
      expect(terserMock).not.toHaveBeenCalled();
    });

    it('returns an empty object for an unknown mode', () => {
      expect(makeOptimization('test' as Mode, {})).toEqual({});
    });

    it('adds no vendor cache group without a vendor list', () => {
      const optimization = makeOptimization('production', {});

      expect(optimization['splitChunks']).not.toHaveProperty('cacheGroups');
    });
  });

  describe('positive cases', () => {
    it('minimizes images, scripts and styles in production', () => {
      const optimization = makeOptimization('production', {});

      expect(optimization).toMatchObject({ chunkIds: 'total-size', minimize: true, moduleIds: 'size' });
      expect(optimization['minimizer']).toHaveLength(3);
      expect(imageMinimizerMock).toHaveBeenCalledWith({
        minimizer: expect.objectContaining({ implementation: 'sharpMinify' }) as unknown,
      });
      expect(cssMinimizerMock).toHaveBeenCalledWith();
      expect(terserMock).toHaveBeenCalledWith({
        // eslint-disable-next-line camelcase
        terserOptions: expect.objectContaining({ compress: { drop_console: true } }) as unknown,
      });
    });

    it('keeps names and console output in production debug builds', () => {
      const optimization = makeOptimization('production', { debug: true });

      expect(optimization).toMatchObject({ chunkIds: 'named', moduleIds: 'named' });
      expect(terserMock).toHaveBeenCalledWith({
        // eslint-disable-next-line camelcase
        terserOptions: expect.objectContaining({ compress: { drop_console: false } }) as unknown,
      });
    });

    it.each(['development', 'production'] as const)('splits the vendor chunk in %s', (mode) => {
      const optimization = makeOptimization(mode, { vendor: ['react'] });

      expect(optimization['splitChunks']).toMatchObject({ cacheGroups: vendorCacheGroups });
    });
  });
});
