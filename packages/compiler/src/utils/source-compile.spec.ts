import { transformFileSync } from '@babel/core';
import { getMode, getRootRequireDir } from '@rockpack/utils';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { sourceCompile } from './source-compile.js';

// @babel/core 8 is ESM only and Jest's CommonJS runtime cannot load it; compiler-e2e checks the real output.
jest.mock('@babel/core', () => ({ transformFileSync: jest.fn() }));

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
    (transformFileSync as jest.Mock).mockImplementation((file: string) => ({ code: `// ${path.basename(file)}` }));
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

    it('skips a format without src or dist instead of building into the project root', async () => {
      await sourceCompile({
        cjs: { dist: 'lib/cjs', src: 'src' },
        esm: { dist: 'lib/esm' } as { dist: string; src: string },
      });

      expect(existsSync(path.join(root, 'tsconfig.json'))).toBe(true);
      expect(existsSync(path.join(root, 'lib', 'cjs', 'index.cjs'))).toBe(true);
      expect(existsSync(path.join(root, 'lib', 'esm'))).toBe(false);
    });

    it('throws for TypeScript sources without a tsconfig', async () => {
      rmSync(path.join(root, 'tsconfig.json'));

      await expect(sourceCompile({ esm: { dist: 'lib/esm', src: 'src' } })).rejects.toThrow('tsconfig not found');
    });

    it('writes no file when Babel returns no code', async () => {
      (transformFileSync as jest.Mock).mockReturnValue(null);

      await sourceCompile({ esm: { dist: 'lib/esm', src: 'src' } });

      expect(existsSync(path.join(root, 'lib', 'esm', 'index.mjs'))).toBe(false);
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
    it('skips the files matching a custom ignore list instead of the default one', async () => {
      writeFileSync(path.join(root, 'src', 'draft.ts'), 'export const draft = 1;');

      await sourceCompile({ cjs: { dist: 'lib/cjs', src: 'src' }, ignore: ['**/draft.ts'] });

      expect(existsSync(path.join(root, 'lib', 'cjs', 'draft.cjs'))).toBe(false);
      expect(existsSync(path.join(root, 'lib', 'cjs', 'index.cjs'))).toBe(true);
    });

    it('compiles TypeScript to cjs and esm with the import extension of each format and copied assets', async () => {
      await sourceCompile({ cjs: { dist: 'lib/cjs', src: 'src' }, esm: { dist: 'lib/esm', src: 'src' } });

      const optionsFor = (output: string): { plugins: unknown[] } => {
        const call = (transformFileSync as jest.Mock).mock.calls.find(
          ([file, options]: [string, { plugins: unknown[] }]) =>
            file.endsWith('index.ts') && JSON.stringify(options.plugins).includes(output),
        ) as [string, { plugins: unknown[] }];

        return call[1];
      };

      expect(optionsFor('"cjs"').plugins.slice(0, 2)).toEqual([
        [expect.stringContaining('import-extension'), { extension: 'cjs' }],
        expect.stringContaining('plugin-transform-modules-commonjs'),
      ]);
      expect(optionsFor('"mjs"').plugins[0]).toEqual([
        expect.stringContaining('import-extension'),
        { extension: 'mjs' },
      ]);
      expect(readFileSync(path.join(root, 'lib', 'cjs', 'index.cjs'), 'utf8')).toBe('// index.ts');
      expect(readFileSync(path.join(root, 'lib', 'esm', 'utils', 'sum.mjs'), 'utf8')).toBe('// sum.ts');
      expect(existsSync(path.join(root, 'lib', 'esm', 'label.mjs'))).toBe(true);
      expect(readFileSync(path.join(root, 'lib', 'cjs', 'assets', 'data.txt'), 'utf8')).toBe('asset\n');
      expect(existsSync(path.join(root, 'lib', 'esm', 'legacy.mjs'))).toBe(false);
    });

    it('compiles a JavaScript-only project', async () => {
      ['index.ts', 'label.tsx', 'utils/sum.ts'].forEach((file) => rmSync(path.join(root, 'src', file)));

      await sourceCompile({ esm: { dist: 'lib/esm', src: 'src' } });

      expect(readFileSync(path.join(root, 'lib', 'esm', 'legacy.mjs'), 'utf8')).toBe('// legacy.js');
    });
  });
});
