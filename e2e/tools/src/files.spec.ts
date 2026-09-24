import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { listFiles, matchGolden } from './files.js';

describe('files', () => {
  const originalUpdate = process.env['E2E_UPDATE_GOLDEN'];
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'rockpack-e2e-tools-'));
    delete process.env['E2E_UPDATE_GOLDEN'];
  });

  afterEach(() => {
    rmSync(dir, { force: true, recursive: true });
    if (originalUpdate === undefined) {
      delete process.env['E2E_UPDATE_GOLDEN'];
    } else {
      process.env['E2E_UPDATE_GOLDEN'] = originalUpdate;
    }
  });

  describe('negative cases', () => {
    it('skips .git and node_modules', () => {
      for (const file of ['.git/HEAD', 'node_modules/a/index.js', 'src/index.ts']) {
        mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
        writeFileSync(path.join(dir, file), '');
      }

      expect(listFiles(dir)).toEqual(['src/index.ts']);
    });

    it('reports a golden mismatch without rewriting the golden file', () => {
      const golden = path.join(dir, 'golden.txt');
      writeFileSync(golden, 'expected\n');

      expect(matchGolden(golden, 'actual\n')).toEqual({ actual: 'actual\n', expected: 'expected\n' });
      expect(readFileSync(golden, 'utf8')).toBe('expected\n');
    });
  });

  describe('positive cases', () => {
    it('lists files sorted with POSIX separators', () => {
      for (const file of ['b.txt', 'a/z.txt', 'a/b/c.txt']) {
        mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
        writeFileSync(path.join(dir, file), '');
      }

      expect(listFiles(dir)).toEqual(['a/b/c.txt', 'a/z.txt', 'b.txt']);
    });

    it('writes a missing golden file', () => {
      const golden = path.join(dir, 'golden', 'new.txt');

      expect(matchGolden(golden, 'first\n')).toEqual({ actual: 'first\n', expected: 'first\n' });
      expect(readFileSync(golden, 'utf8')).toBe('first\n');
    });

    it('rewrites the golden file with E2E_UPDATE_GOLDEN=1', () => {
      const golden = path.join(dir, 'golden.txt');
      writeFileSync(golden, 'old\n');
      process.env['E2E_UPDATE_GOLDEN'] = '1';

      expect(matchGolden(golden, 'new\n').expected).toBe('new\n');
    });
  });
});
