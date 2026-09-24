import { getRootRequireDir } from '@rockpack/utils';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { getFiles, getTypeScript, writeFile } from './file-system-utils.js';

jest.mock('@rockpack/utils', () => ({ getRootRequireDir: jest.fn() }));

const getRootRequireDirMock = getRootRequireDir as jest.MockedFunction<typeof getRootRequireDir>;

const createFiles = (root: string, files: string[]): void => {
  files.forEach((file) => {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), '');
  });
};

const relative = (root: string, files: string[]): string[] => files.map((file) => path.relative(root, file)).sort();

describe('file system utils', () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'rockpack-compiler-'));
    getRootRequireDirMock.mockReturnValue(root);
    createFiles(root, [
      'src/index.ts',
      'src/view.tsx',
      'src/types.d.ts',
      'src/legacy.js',
      'src/nested/deep.ts',
      'src/skip/ignored.ts',
    ]);
  });

  afterEach(() => {
    rmSync(root, { force: true, recursive: true });
  });

  describe('negative cases', () => {
    it('returns no directories', async () => {
      expect(relative(root, await getFiles('src'))).not.toContain(path.join('src', 'nested'));
    });

    it('skips declaration files and non-ts sources when collecting TypeScript', async () => {
      const files = relative(root, await getTypeScript('src'));

      expect(files).not.toContain(path.join('src', 'types.d.ts'));
      expect(files).not.toContain(path.join('src', 'legacy.js'));
    });

    it('applies ignore patterns', async () => {
      const files = relative(root, await getTypeScript('src', [path.join(root, 'src/skip/**')]));

      expect(files).not.toContain(path.join('src', 'skip', 'ignored.ts'));
    });
  });

  describe('positive cases', () => {
    it('lists every file under the source folder', async () => {
      expect(relative(root, await getFiles('src'))).toEqual(
        [
          'src/index.ts',
          'src/legacy.js',
          'src/nested/deep.ts',
          'src/skip/ignored.ts',
          'src/types.d.ts',
          'src/view.tsx',
        ].map((file) => path.join(...file.split('/'))),
      );
    });

    it('filters files by query', async () => {
      expect(relative(root, await getFiles('src', '*.js'))).toEqual([path.join('src', 'legacy.js')]);
    });

    it('collects ts and tsx sources', async () => {
      expect(relative(root, await getTypeScript('src'))).toEqual(
        ['src/index.ts', 'src/nested/deep.ts', 'src/skip/ignored.ts', 'src/view.tsx'].map((file) =>
          path.join(...file.split('/')),
        ),
      );
    });

    it('writes a file and creates missing folders', () => {
      writeFile(path.join(root, 'out', 'nested', 'file.txt'), 'content');

      expect(readFileSync(path.join(root, 'out', 'nested', 'file.txt'), 'utf8')).toBe('content');
    });
  });
});
