import type * as Fs from 'node:fs';

import { existsSync, mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { resolveTsc } from './resolve-tsc.js';

jest.mock('node:fs', () => {
  const actual = jest.requireActual<typeof Fs>('node:fs');

  return { ...actual, existsSync: jest.fn(actual.existsSync) };
});

const installTypeScript = (root: string, bin: Record<string, string>, binaryFile?: string): void => {
  const dir = path.join(root, 'node_modules', 'typescript');
  mkdirSync(path.join(dir, 'bin'), { recursive: true });
  writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ bin, name: 'typescript', version: '7.0.2' }));
  if (binaryFile) {
    writeFileSync(path.join(dir, binaryFile), '');
  }
};

describe('resolveTsc', () => {
  let root: string;

  beforeEach(() => {
    // The real path: require.resolve follows the /var -> /private/var link of the macOS temp folder.
    root = realpathSync(mkdtempSync(path.join(tmpdir(), 'rockpack-resolve-tsc-')));
    writeFileSync(path.join(root, 'package.json'), '{}');
  });

  afterEach(() => {
    rmSync(root, { force: true, recursive: true });
    jest.mocked(existsSync).mockImplementation(jest.requireActual<typeof Fs>('node:fs').existsSync);
  });

  describe('negative cases', () => {
    it('throws when no TypeScript provides a tsc binary', () => {
      jest.mocked(existsSync).mockReturnValue(false);

      expect(() => resolveTsc(root)).toThrow('TypeScript not found');
    });

    it("falls back to the compiler's TypeScript when the project's has no tsc binary", () => {
      installTypeScript(root, { tsc6: 'bin/tsc6' }, 'bin/tsc6');

      expect(resolveTsc(root)).not.toContain(root);
      expect(resolveTsc(root)).toMatch(/node_modules[\\/]typescript[\\/]bin[\\/]tsc$/);
    });
  });

  describe('positive cases', () => {
    it("uses the project's own TypeScript", () => {
      installTypeScript(root, { tsc: 'bin/tsc' }, 'bin/tsc');

      expect(resolveTsc(root)).toBe(path.join(root, 'node_modules', 'typescript', 'bin', 'tsc'));
    });

    it("uses the compiler's TypeScript when the project has none", () => {
      expect(resolveTsc(root)).toMatch(/node_modules[\\/]typescript[\\/]bin[\\/]tsc$/);
    });
  });
});
