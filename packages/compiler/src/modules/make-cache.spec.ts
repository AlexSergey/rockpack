import path from 'node:path';

import type { InternalCompilerConf } from '../types.js';

import { makeCache } from './make-cache.js';

const root = '/project';
const conf = (props: Partial<InternalCompilerConf> = {}): InternalCompilerConf => ({
  dist: 'dist/index.js',
  src: 'src/index',
  ...props,
});

describe('makeCache', () => {
  describe('negative cases', () => {
    it('does not cache production builds on disk by default', () => {
      expect(makeCache(conf(), root, 'production')).toBe(false);
      expect(makeCache(conf({ cache: false }), root, 'production')).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('keeps the memory cache in development', () => {
      expect(makeCache(conf({ cache: true }), root, 'development')).toBe(true);
    });

    it('caches production builds in node_modules/.cache/rockpack with cache: true', () => {
      const cache = makeCache(conf({ cache: true, compilerName: 'frontendCompiler' }), root, 'production');

      expect(cache).toMatchObject({
        cacheDirectory: path.join(root, 'node_modules', '.cache', 'rockpack'),
        name: 'frontendCompiler-production',
        type: 'filesystem',
      });
    });

    it('invalidates the cache when the build script or the compiler change', () => {
      const cache = makeCache(conf({ cache: true }), root, 'production');
      const config = typeof cache === 'object' ? cache.buildDependencies.config : [];

      expect(config).toContain(process.argv[1]);
      expect(config.some((file) => file.includes('make-cache'))).toBe(true);
    });
  });
});
