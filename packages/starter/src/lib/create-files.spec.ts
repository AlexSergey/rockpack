import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import type * as Mocks from '../__fixtures__/mocks.js';
import type * as PathesModule from '../utils/pathes.js';

import { showError } from '../utils/error.js';
import { dummies } from '../utils/pathes.js';
import { createFiles } from './create-files.js';

jest.mock('change-case', () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks.js').changeCaseModule);
jest.mock('../utils/error.js', () => ({ showError: jest.fn() }));
jest.mock('../utils/pathes.js', () => {
  const actual = jest.requireActual<typeof PathesModule>('../utils/pathes.js');

  return {
    ...actual,
    get dummies(): string {
      return mockDummies.path;
    },
  };
});

const mockDummies = { path: '' };
const showErrorMock = showError as jest.MockedFunction<typeof showError>;

const readBuild = (dir: string): string => readFileSync(path.join(dir, 'scripts.build.ts'), 'utf8');

describe('createFiles', () => {
  let dir: string;
  let realDummies: string;

  beforeAll(() => {
    realDummies = jest.requireActual<{ dummies: string }>('../utils/pathes.js').dummies;
  });

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'rockpack-starter-'));
    mockDummies.path = realDummies;
  });

  afterEach(() => {
    rmSync(dir, { force: true, recursive: true });
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it.each([
      ['library', 'Step: 7.1. Creating library scripts.build.ts'],
      ['component', 'Step: 7.1. Creating component scripts.build.ts'],
    ] as const)('reports an unreadable %s dummy', (appType, step) => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockDummies.path = path.join(dir, 'missing');

      createFiles(dir, { appType, projectName: 'app' });

      expect(showErrorMock).toHaveBeenCalledWith(expect.objectContaining({ code: 'ENOENT' }), expect.any(Function));
      showErrorMock.mock.calls[0]?.[1]?.();
      expect(errorSpy).toHaveBeenCalledWith(step);
      errorSpy.mockRestore();
    });

    it.each(['csr', 'ssr'] as const)('writes no build script for %s', (appType) => {
      createFiles(dir, { appType, projectName: 'app' });

      expect(existsSync(path.join(dir, 'scripts.build.ts'))).toBe(false);
    });

    it('does not create .env without .env.example', () => {
      createFiles(dir, { appType: 'csr', projectName: 'app' });

      expect(existsSync(path.join(dir, '.env'))).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('copies .env.example to .env', () => {
      writeFileSync(path.join(dir, '.env.example'), 'PORT=3000\n');

      createFiles(dir, { appType: 'csr', projectName: 'app' });

      expect(readFileSync(path.join(dir, '.env'), 'utf8')).toBe('PORT=3000\n');
    });

    it('writes the library build script with the pascal-cased name', () => {
      createFiles(dir, { appType: 'library', projectName: 'my-lib' });

      expect(readBuild(dir)).toBe(
        readFileSync(path.join(dummies, 'build.library'), 'utf8').replace(/%libraryName%/g, 'MyLib'),
      );
    });

    it('writes the component build script with the pascal-cased name', () => {
      createFiles(dir, { appType: 'component', projectName: 'my-button' });

      expect(readBuild(dir)).toBe(
        readFileSync(path.join(dummies, 'build.component'), 'utf8').replace(/%componentName%/g, 'MyButton'),
      );
    });

    it.each([
      ['library', '7', /%libraryName%/g, 'Library7'],
      ['component', '7', /%componentName%/g, 'Component7'],
      ['library', 'x', /%libraryName%/g, 'X'],
    ] as const)('names a %s called "%s" as %s', (appType, projectName, placeholder, expected) => {
      createFiles(dir, { appType, projectName });

      expect(readBuild(dir)).toBe(
        readFileSync(path.join(dummies, `build.${appType}`), 'utf8').replace(placeholder, expected),
      );
    });
  });
});
