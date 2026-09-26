import { getMode } from '@rockpack/utils';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { generateDts } from './generate-dts.js';

jest.mock('@rockpack/utils', () => ({
  ...jest.requireActual<Record<string, unknown>>('@rockpack/utils'),
  getMode: jest.fn(),
  getRootRequireDir: jest.fn(),
}));
const fixture = path.resolve(__dirname, '../__fixtures__/source-project');

// Every case runs the real tsc (listing the files, then emitting), which takes seconds on a busy CI runner.
jest.setTimeout(30_000);

describe('generateDts', () => {
  let dir: string;
  let root: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'rockpack-compiler-'));
    root = path.join(dir, 'project');
    cpSync(fixture, root, { recursive: true });
    (getMode as jest.Mock).mockReturnValue('production');
  });

  afterEach(() => {
    rmSync(dir, { force: true, recursive: true });
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it('skips a project without a tsconfig', async () => {
      rmSync(path.join(root, 'tsconfig.json'));

      await expect(generateDts({ dist: 'dist/index.js', src: 'src/index' }, root)).resolves.toBeUndefined();
      expect(existsSync(path.join(root, 'dist'))).toBe(false);
    });

    it('emits nothing when the entry folder has no TypeScript files', async () => {
      const jsDir = path.join(root, 'js-only');
      cpSync(path.join(root, 'src'), jsDir, { filter: (file) => !/\.tsx?$/.test(file), recursive: true });
      writeFileSync(path.join(jsDir, 'index.js'), 'export const value = 1;\n');

      await generateDts({ dist: 'dist/index.js', src: 'js-only/index' }, root);

      expect(existsSync(path.join(root, 'dist'))).toBe(false);
    });

    it('emits no declarations for specs', async () => {
      writeFileSync(
        path.join(root, 'src', 'index.spec.ts'),
        "import { total } from './index';\n\nexport const check = total([1]);\n",
      );

      await generateDts({ dist: 'dist/index.js', src: 'src/index' }, root);

      expect(existsSync(path.join(root, 'dist', 'types', 'index.d.ts'))).toBe(true);
      expect(existsSync(path.join(root, 'dist', 'types', 'index.spec.d.ts'))).toBe(false);
    });

    it('rejects with the errors of a declaration emit that failed', async () => {
      writeFileSync(path.join(root, 'src', 'broken.ts'), "export const value: number = 'text';\n");

      await expect(generateDts({ dist: 'dist/index.js', src: 'src/index' }, root)).rejects.toThrow(
        /declarations could not be emitted:\n.*broken\.ts:1:14 TS2322: Type 'string' is not assignable to type 'number'/,
      );
      expect(readdirSync(path.join(root, 'node_modules', '.cache', 'rockpack', 'tsc'))).toEqual([]);
    });

    it('leaves no generated tsconfig in the cache folder', async () => {
      await generateDts({ dist: 'dist/index.js', src: 'src/index' }, root);

      expect(readdirSync(path.join(root, 'node_modules', '.cache', 'rockpack', 'tsc'))).toEqual([]);
    });
  });

  describe('positive cases', () => {
    it('emits only declarations into the types folder next to dist', async () => {
      await generateDts({ dist: 'dist/index.js', src: 'src/index' }, root);

      ['index.d.ts', 'label.d.ts', path.join('utils', 'sum.d.ts')].forEach((file) => {
        expect(existsSync(path.join(root, 'dist', 'types', file))).toBe(true);
      });
      expect(
        readdirSync(path.join(root, 'dist', 'types'), { recursive: true }).filter(
          (file) => !String(file).endsWith('.d.ts') && String(file).includes('.'),
        ),
      ).toEqual([]);
    });

    it('keeps the layout of the imported files outside the entry folder', async () => {
      mkdirSync(path.join(root, 'src', 'bin'));
      writeFileSync(
        path.join(root, 'src', 'bin', 'cli.ts'),
        "import { total } from '../index';\n\nexport const run = total;\n",
      );

      await generateDts({ dist: 'dist/index.js', src: 'src/bin/cli.ts' }, root);

      expect(existsSync(path.join(root, 'dist', 'types', 'bin', 'cli.d.ts'))).toBe(true);
      expect(existsSync(path.join(root, 'dist', 'types', 'index.d.ts'))).toBe(true);
    });

    it('keeps the rootDir of the project tsconfig', async () => {
      const tsconfig = path.join(root, 'tsconfig.json');
      const config = JSON.parse(readFileSync(tsconfig, 'utf8')) as { compilerOptions: Record<string, unknown> };
      writeFileSync(
        tsconfig,
        JSON.stringify({ ...config, compilerOptions: { ...config.compilerOptions, rootDir: '.' } }),
      );

      await generateDts({ dist: 'dist/index.js', src: 'src/index' }, root);

      expect(existsSync(path.join(root, 'dist', 'types', 'src', 'index.d.ts'))).toBe(true);
    });

    it('sees the ambient declarations the project tsconfig includes', async () => {
      writeFileSync(
        path.join(root, 'src', 'declarations.d.ts'),
        "declare module 'untyped-lib' {\n  export const value: number;\n}\n",
      );
      writeFileSync(
        path.join(root, 'src', 'uses.ts'),
        "import { value } from 'untyped-lib';\n\nexport const doubled = value * 2;\n",
      );

      await generateDts({ dist: 'dist/index.js', src: 'src/index' }, root);

      expect(readFileSync(path.join(root, 'dist', 'types', 'uses.d.ts'), 'utf8')).toContain('doubled: number');
    });

    it('emits declarations into an absolute types folder', async () => {
      const types = path.join(dir, 'typings');

      await expect(generateDts({ src: 'src/index.ts', types }, root)).resolves.toBe(path.relative(root, types));
      expect(existsSync(path.join(types, 'index.d.ts'))).toBe(true);
    });

    it('emits declarations into the types folder for a src with extension', async () => {
      await generateDts({ src: 'src/index.ts', types: 'typings' }, root);

      expect(existsSync(path.join(root, 'typings', 'index.d.ts'))).toBe(true);
    });
  });
});
