import path from 'node:path';

import { makeOutput } from './make-output.js';

describe('makeOutput', () => {
  describe('negative cases', () => {
    it('falls back to dist/index.js without a dist option', () => {
      expect(makeOutput({}, '/project', 'production').path).toBe(path.resolve('/project', 'dist'));
    });

    it('adds no umd fields without a library name', () => {
      const output = makeOutput({ dist: 'build/app.js' }, '/project', 'production');

      expect(output).not.toHaveProperty('library');
      expect(output).not.toHaveProperty('libraryTarget');
      expect(output).not.toHaveProperty('globalObject');
    });
  });

  describe('positive cases', () => {
    it('resolves a relative dist against the root', () => {
      expect(makeOutput({ dist: 'build/app.js' }, '/project', 'production')).toEqual({
        clean: true,
        filename: '[name].js',
        path: path.resolve('/project', 'build'),
        pathinfo: false,
        publicPath: '/',
      });
    });

    it('keeps an absolute dist', () => {
      expect(makeOutput({ dist: '/out/app.js' }, '/project', 'production').path).toBe('/out');
    });

    it('adds path info in development', () => {
      expect(makeOutput({}, '/project', 'development').pathinfo).toBe(true);
    });

    it('builds a umd library', () => {
      expect(makeOutput({ library: 'MyLib' }, '/project', 'production')).toMatchObject({
        globalObject: 'globalThis',
        library: 'MyLib',
        libraryTarget: 'umd',
      });
    });
  });
});
