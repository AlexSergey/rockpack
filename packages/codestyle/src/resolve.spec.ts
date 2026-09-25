import { existsSync } from 'node:fs';
import path from 'node:path';

import { resolveFromCodestyle } from './resolve.js';

describe('resolveFromCodestyle', () => {
  describe('negative cases', () => {
    it('throws for a package codestyle does not depend on', () => {
      expect(() => resolveFromCodestyle('rockpack-missing-package')).toThrow();
    });
  });

  describe('positive cases', () => {
    it('returns the absolute path of an installed entry file', () => {
      const resolved = resolveFromCodestyle('@commitlint/config-conventional');

      expect(path.isAbsolute(resolved)).toBe(true);
      expect(resolved).toContain(path.join('@commitlint', 'config-conventional'));
      expect(existsSync(resolved)).toBe(true);
    });
  });
});
