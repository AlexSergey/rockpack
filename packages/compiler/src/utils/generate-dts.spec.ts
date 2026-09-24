import type * as fs from 'node:fs';

import { getMode } from '@rockpack/utils';
import { cpSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { generateDts } from './generate-dts.js';

jest.mock('@rockpack/utils', () => ({ getMode: jest.fn(), getRootRequireDir: jest.fn() }));
const fixture = path.resolve(__dirname, '../__fixtures__/source-project');

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
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      rmSync(path.join(root, 'tsconfig.json'));

      await generateDts({ dist: 'dist/index.js', src: 'src/index' }, root);

      expect(errorSpy).toHaveBeenCalledWith("It's not TS project");
      expect(existsSync(path.join(root, 'dist'))).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('emits declarations next to dist and removes the temp folder', async () => {
      const mkdtempSpy = jest.spyOn(jest.requireActual<typeof fs>('node:fs'), 'mkdtempSync');

      await generateDts({ dist: 'dist/index.js', src: 'src/index' }, root);

      ['index.d.ts', 'label.d.ts', path.join('utils', 'sum.d.ts')].forEach((file) => {
        expect(existsSync(path.join(root, 'dist', 'types', file))).toBe(true);
      });
      expect(existsSync(String(mkdtempSpy.mock.results[0]?.value))).toBe(false);
    });

    it('emits declarations into the types folder for a src with extension', async () => {
      await generateDts({ src: 'src/index.ts', types: 'typings' }, root);

      expect(existsSync(path.join(root, 'typings', 'index.d.ts'))).toBe(true);
    });
  });
});
