import { execSync } from 'node:child_process';

import { getPM } from './other';

const mockArgv: Record<string, unknown> = {};

jest.mock('node:child_process', () => ({ execSync: jest.fn() }));
jest.mock('./argv', () => ({
  get argv(): Record<string, unknown> {
    return mockArgv;
  },
}));

const execSyncMock = execSync as jest.MockedFunction<typeof execSync>;

describe('getPM', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    delete mockArgv['yarn'];
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('returns npm when the yarn flag is not set', () => {
      expect(getPM()).toBe('npm');
      expect(execSyncMock).not.toHaveBeenCalled();
    });

    it('returns npm when yarn is requested but not installed', () => {
      mockArgv['yarn'] = true;
      execSyncMock.mockImplementation(() => {
        throw new Error('yarnpkg: command not found');
      });

      expect(getPM()).toBe('npm');
    });
  });

  describe('positive cases', () => {
    it('returns yarn when yarn is requested and installed', () => {
      mockArgv['yarn'] = true;
      execSyncMock.mockReturnValue(Buffer.from('1.22.22'));

      expect(getPM()).toBe('yarn');
    });
  });
});
