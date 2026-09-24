import { getMode, getRootRequireDir } from '@rockpack/utils';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { sourceCompile } from './source-compile.js';

jest.mock('@rockpack/utils', () => ({
  ...jest.requireActual<Record<string, unknown>>('@rockpack/utils'),
  getMode: jest.fn(),
  getRootRequireDir: jest.fn(),
  readPackageJson: jest.fn(),
}));

const fixture = path.resolve(__dirname, '../__fixtures__/source-project');

describe('sourceCompile', () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'rockpack-compiler-'));
    cpSync(fixture, root, { recursive: true });
    (getRootRequireDir as jest.Mock).mockReturnValue(root);
    (getMode as jest.Mock).mockReturnValue('production');
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    rmSync(root, { force: true, recursive: true });
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it('throws when no format has a string src and dist', async () => {
      await expect(sourceCompile({ esm: { dist: 'lib/esm', src: 42 as unknown as string } })).rejects.toThrow(
        'cjs, esm fields are not object',
      );
    });

    it('throws for TypeScript sources without a tsconfig', async () => {
      rmSync(path.join(root, 'tsconfig.json'));

      await expect(sourceCompile({ esm: { dist: 'lib/esm', src: 'src' } })).rejects.toThrow('tsconfig not found');
    });

    it('skips test files and emits nothing for an empty source folder', async () => {
      writeFileSync(path.join(root, 'src', 'index.spec.ts'), 'export {};');
      rmSync(path.join(root, 'src', 'utils'), { recursive: true });

      await sourceCompile({ cjs: { dist: 'lib/cjs', src: 'src' }, esm: { dist: 'lib/empty', src: 'empty' } });

      expect(existsSync(path.join(root, 'lib', 'cjs', 'index.spec.cjs'))).toBe(false);
      expect(existsSync(path.join(root, 'lib', 'empty'))).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('compiles TypeScript to cjs and esm with extension-mapped imports and copied assets', async () => {
      await sourceCompile({ cjs: { dist: 'lib/cjs', src: 'src' }, esm: { dist: 'lib/esm', src: 'src' } });

      const cjs = readFileSync(path.join(root, 'lib', 'cjs', 'index.cjs'), 'utf8');
      const esm = readFileSync(path.join(root, 'lib', 'esm', 'index.mjs'), 'utf8');

      expect(cjs).toContain('require("./utils/sum.cjs")');
      expect(esm).toContain('from "./utils/sum.mjs"');
      expect(existsSync(path.join(root, 'lib', 'esm', 'label.mjs'))).toBe(true);
      expect(readFileSync(path.join(root, 'lib', 'cjs', 'assets', 'data.txt'), 'utf8')).toBe('asset\n');
      expect(existsSync(path.join(root, 'lib', 'esm', 'legacy.mjs'))).toBe(false);
    });

    it('compiles a JavaScript-only project', async () => {
      ['index.ts', 'label.tsx', 'utils/sum.ts'].forEach((file) => rmSync(path.join(root, 'src', file)));

      await sourceCompile({ esm: { dist: 'lib/esm', src: 'src' } });

      expect(readFileSync(path.join(root, 'lib', 'esm', 'legacy.mjs'), 'utf8')).toContain('legacy');
    });
  });
});
