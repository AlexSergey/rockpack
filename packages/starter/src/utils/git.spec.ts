import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import type * as Mocks from '../__fixtures__/mocks.js';

import { findGitRepoInParent, gitIsAvailable, makeRepo } from './git.js';

jest.mock('chalk', () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks.js').chalkModule);
jest.mock('node:child_process', () => ({ execSync: jest.fn() }));
jest.mock('node:fs', () => ({ existsSync: jest.fn() }));

const execSyncMock = execSync as jest.MockedFunction<typeof execSync>;
const existsSyncMock = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;

const mockGitDirs = (...dirs: string[]): void => {
  existsSyncMock.mockImplementation((file) => dirs.map((dir) => path.join(dir, '.git')).includes(String(file)));
};

describe('git utils', () => {
  let errorSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('reports git as unavailable when "git --version" fails', () => {
      const error = new Error('git: command not found');
      execSyncMock.mockImplementation(() => {
        throw error;
      });

      expect(gitIsAvailable()).toBe(false);
      expect(errorSpy).toHaveBeenCalledWith(error);
    });

    it('finds no repository when no directory up to the root has .git', () => {
      mockGitDirs();

      expect(findGitRepoInParent('/work/projects/app')).toBe(false);
      expect(existsSyncMock).toHaveBeenLastCalledWith(path.join('/', '.git'));
    });

    it('reports a failed "git init"', () => {
      const error = new Error('permission denied');
      execSyncMock.mockImplementation(() => {
        throw error;
      });

      expect(makeRepo('/work/app')).toBe(false);
      expect(errorSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('positive cases', () => {
    it('reports git as available when "git --version" succeeds', () => {
      execSyncMock.mockReturnValue(Buffer.from(''));

      expect(gitIsAvailable()).toBe(true);
      expect(execSyncMock).toHaveBeenCalledWith('git --version', { stdio: 'ignore' });
    });

    it('finds a repository in the start directory', () => {
      mockGitDirs('/work/app');

      expect(findGitRepoInParent('/work/app')).toBe(true);
      expect(existsSyncMock).toHaveBeenCalledTimes(1);
    });

    it('finds a repository in a parent directory', () => {
      mockGitDirs('/work');

      expect(findGitRepoInParent('/work/projects/app')).toBe(true);
    });

    it('runs "git init" in the given directory', () => {
      execSyncMock.mockReturnValue(Buffer.from(''));

      expect(makeRepo('/work/app')).toBe(true);
      expect(execSyncMock).toHaveBeenCalledWith('git init', { cwd: '/work/app', stdio: 'ignore' });
      expect(logSpy).toHaveBeenCalledWith('GIT initialized');
    });
  });
});
