import { execSync } from 'node:child_process';

import { getPM, getPMVersion } from './other';

const mockArgv: Record<string, unknown> = {};

jest.mock('node:child_process', () => ({ execSync: jest.fn() }));
jest.mock('./argv', () => ({
  get argv(): Record<string, unknown> {
    return mockArgv;
  },
}));

const execSyncMock = execSync as jest.MockedFunction<typeof execSync>;

const mockYarnMissing = (): void => {
  execSyncMock.mockImplementation((command) => {
    if (command === 'yarnpkg --version') {
      throw new Error('yarnpkg: command not found');
    }

    return Buffer.from('11.6.0\n');
  });
};

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  delete mockArgv['yarn'];
  jest.resetAllMocks();
});

describe('getPM', () => {
  describe('negative cases', () => {
    it('returns npm when the yarn flag is not set', () => {
      expect(getPM()).toBe('npm');
      expect(execSyncMock).not.toHaveBeenCalled();
    });

    it('returns npm when yarn is requested but not installed', () => {
      mockArgv['yarn'] = true;
      mockYarnMissing();

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

describe('getPMVersion', () => {
  describe('negative cases', () => {
    it('reports the npm version when yarn is requested but not installed', () => {
      mockArgv['yarn'] = true;
      mockYarnMissing();

      expect(getPMVersion()).toBe('11.6.0\n');
      expect(execSyncMock).toHaveBeenLastCalledWith('npm -v');
    });
  });

  describe('positive cases', () => {
    it('reports the raw npm version output', () => {
      execSyncMock.mockReturnValue(Buffer.from('11.6.0\n'));

      expect(getPMVersion()).toBe('11.6.0\n');
      expect(execSyncMock).toHaveBeenCalledWith('npm -v');
    });

    it('reports the yarn version when yarn is used', () => {
      mockArgv['yarn'] = true;
      execSyncMock.mockReturnValue(Buffer.from('1.22.22\n'));

      expect(getPMVersion()).toBe('1.22.22\n');
      expect(execSyncMock).toHaveBeenLastCalledWith('yarnpkg --version');
    });
  });
});
