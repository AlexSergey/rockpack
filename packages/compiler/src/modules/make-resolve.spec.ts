import path from 'node:path';

import { makeResolve } from './make-resolve.js';

describe('makeResolve', () => {
  describe('negative cases', () => {
    it('does not resolve css or json by extension', () => {
      expect(makeResolve('/project').extensions).not.toEqual(expect.arrayContaining(['.css', '.json']));
    });
  });

  describe('positive cases', () => {
    it('resolves script extensions from the project and hoisted node_modules', () => {
      expect(makeResolve('/project')).toEqual({
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
        modules: [path.resolve('/project', 'node_modules'), 'node_modules'],
      });
    });
  });
});
