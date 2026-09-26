import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type * as Mocks from '../__fixtures__/mocks.js';
import type { AppType } from './wizard.js';

import { dummies } from '../utils/pathes.js';
import { writeMetaFiles } from './write-meta-files.js';

jest.mock('chalk', () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks.js').chalkModule);
jest.mock('../utils/error.js', () => ({ showError: jest.fn() }));
jest.mock('../utils/project.js', () => ({}));

const readDummy = (dummy: string): string => fs.readFileSync(path.join(dummies, dummy), 'utf8');

describe('writeMetaFiles', () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rockpack-meta-'));
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    fs.rmSync(dir, { force: true, recursive: true });
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it.each<AppType>(['csr', 'ssr'])('writes no .npmignore for a %s application', (appType) => {
      writeMetaFiles(dir, { appType });

      expect(fs.existsSync(path.join(dir, '.npmignore'))).toBe(false);
    });

    it.each<AppType>(['csr', 'library', 'component'])('does not ignore public/ in a %s project', (appType) => {
      writeMetaFiles(dir, { appType });

      expect(fs.readFileSync(path.join(dir, '.gitignore'), 'utf8').split('\n')).not.toContain('/public');
    });
  });

  describe('positive cases', () => {
    it.each<AppType>(['csr', 'library', 'component'])('writes .gitignore and .gitattributes for %s', (appType) => {
      writeMetaFiles(dir, { appType });

      expect(fs.readFileSync(path.join(dir, '.gitignore'), 'utf8')).toBe(readDummy('gitignore'));
      expect(fs.readFileSync(path.join(dir, '.gitattributes'), 'utf8')).toBe(readDummy('gitattributes'));
    });

    it.each<AppType>(['library', 'component'])('writes .npmignore for a published %s', (appType) => {
      writeMetaFiles(dir, { appType });

      expect(fs.readFileSync(path.join(dir, '.npmignore'), 'utf8')).toBe(readDummy('npmignore'));
    });

    it('adds the frontend build folder public/ to the .gitignore of an ssr project', () => {
      writeMetaFiles(dir, { appType: 'ssr' });

      expect(fs.readFileSync(path.join(dir, '.gitignore'), 'utf8')).toBe(
        `${readDummy('gitignore')}\n# The frontend build of the ssr app\n/public\n`,
      );
      expect(fs.readFileSync(path.join(dir, '.gitattributes'), 'utf8')).toBe(readDummy('gitattributes'));
    });

    it('ignores the library build output at the project root only', () => {
      const lines = readDummy('gitignore').split('\n');

      expect(lines).toContain('/lib');
      expect(lines).not.toContain('lib');
    });
  });
});
