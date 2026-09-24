import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { packageRoot } from './package-root.js';

describe('packageRoot', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(os.tmpdir(), 'rockpack-package-root-'));
  });

  afterEach(() => {
    rmSync(dir, { force: true, recursive: true });
  });

  describe('negative cases', () => {
    it('returns the module folder when no package.json is found above it', () => {
      const moduleDir = path.join(dir, 'lib/utils');
      mkdirSync(moduleDir, { recursive: true });

      expect(packageRoot(pathToFileURL(path.join(moduleDir, 'index.mjs')).href)).toBe(
        path.dirname(path.join(moduleDir, 'index.mjs')),
      );
    });
  });

  describe('positive cases', () => {
    it('finds the nearest package.json above a nested module', () => {
      writeFileSync(path.join(dir, 'package.json'), '{}');
      mkdirSync(path.join(dir, 'lib/esm/utils'), { recursive: true });

      expect(packageRoot(pathToFileURL(path.join(dir, 'lib/esm/utils/file.mjs')).href)).toBe(dir);
    });
  });
});
