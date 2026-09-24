import type { Stats } from 'node:fs';

import { statSync } from 'node:fs';

import { getRootRequireDir } from './require-dir.js';

jest.mock('node:fs', () => ({ statSync: jest.fn() }));

const statSyncMock = statSync as unknown as jest.MockedFunction<(path: string) => Stats>;
const originalArgv = process.argv;

const mockStat = (isFile: boolean): void => {
  statSyncMock.mockReturnValue({ isFile: () => isFile } as Stats);
};

describe('getRootRequireDir', () => {
  afterEach(() => {
    process.argv = originalArgv;
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('propagates the error when the entry path does not exist', () => {
      process.argv = ['node', '/missing/script.js'];
      statSyncMock.mockImplementation(() => {
        throw new Error('ENOENT');
      });

      expect(() => getRootRequireDir()).toThrow('ENOENT');
    });
  });

  describe('positive cases', () => {
    it('uses an explicitly given script path instead of the process arguments', () => {
      process.argv = ['node', '/ignored/script.js'];
      mockStat(true);

      expect(getRootRequireDir('/project/scripts.build.ts')).toBe('/project');
    });

    it('returns the directory of the entry file', () => {
      process.argv = ['node', '/project/scripts/build.js'];
      mockStat(true);

      expect(getRootRequireDir()).toBe('/project/scripts');
    });

    it('returns the entry path itself when it is a directory', () => {
      process.argv = ['node', '/project'];
      mockStat(false);

      expect(getRootRequireDir()).toBe('/project');
    });

    it('uses the current working directory when there is no entry path', () => {
      process.argv = ['node'];
      mockStat(false);

      expect(getRootRequireDir()).toBe(process.cwd());
      expect(statSyncMock).toHaveBeenCalledWith(process.cwd());
    });
  });
});
