import { spawnSync } from 'node:child_process';

import type * as Mocks from '../__fixtures__/mocks.js';

import { gitHooks } from './git-hooks.js';
import { getPM } from './other.js';

jest.mock('chalk', () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks.js').chalkModule);
jest.mock('node:child_process', () => ({ spawnSync: jest.fn() }));
jest.mock('./other.js', () => ({ getPM: jest.fn() }));

const spawnSyncMock = spawnSync as jest.MockedFunction<typeof spawnSync>;
const getPMMock = getPM as jest.MockedFunction<typeof getPM>;

const spawnResult = (result: Partial<ReturnType<typeof spawnSync>>): ReturnType<typeof spawnSync> => ({
  output: [],
  pid: 1,
  signal: null,
  status: 0,
  stderr: Buffer.from(''),
  stdout: Buffer.from(''),
  ...result,
});

describe('gitHooks', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    spawnSyncMock.mockReturnValue(spawnResult({}));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('runs nothing but simple-git-hooks', () => {
      getPMMock.mockReturnValue('npm');

      gitHooks('/work/app');

      expect(spawnSyncMock).toHaveBeenCalledTimes(1);
    });

    it('warns when simple-git-hooks exits with an error', () => {
      getPMMock.mockReturnValue('npm');
      spawnSyncMock.mockReturnValue(spawnResult({ status: 1 }));

      gitHooks('/work/app');

      expect(warnSpy).toHaveBeenCalledWith(
        'WARNING:   The git hooks were not installed. Run "npx simple-git-hooks" in the project folder.',
      );
    });

    it('warns when the command cannot be started', () => {
      getPMMock.mockReturnValue('yarn');
      spawnSyncMock.mockReturnValue(spawnResult({ error: new Error('spawn yarn ENOENT'), status: null }));

      gitHooks('/work/app');

      expect(warnSpy).toHaveBeenCalledWith(
        'WARNING:   The git hooks were not installed. Run "yarn simple-git-hooks" in the project folder.',
      );
    });
  });

  describe('positive cases', () => {
    it('installs the hooks with npx', () => {
      getPMMock.mockReturnValue('npm');

      gitHooks('/work/app');

      expect(spawnSyncMock).toHaveBeenCalledWith('npx', ['simple-git-hooks'], { cwd: '/work/app' });
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('installs the hooks with yarn', () => {
      getPMMock.mockReturnValue('yarn');

      gitHooks('/work/app');

      expect(spawnSyncMock).toHaveBeenCalledWith('yarn', ['simple-git-hooks'], { cwd: '/work/app' });
    });
  });
});
