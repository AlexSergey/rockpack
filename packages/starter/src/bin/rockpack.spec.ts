import latestVersion from 'latest-version';
import fs from 'node:fs';
import path from 'node:path';

import type * as Mocks from '../__fixtures__/mocks';

import { ExitError, mockProcessExit } from '../__fixtures__/process-exit';
import { install } from '../lib/install';
import { packageJson } from '../utils/package-json';
import { rockpack } from './rockpack';

const mockArgv: Record<string, unknown> = {};
const mockCwd = '/work/my project';

jest.mock('chalk', () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks').chalkModule);
jest.mock('latest-version', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('node:fs', () => ({
  ...jest.requireActual<typeof fs>('node:fs'),
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
}));
jest.mock('../lib/install', () => ({ install: jest.fn() }));
jest.mock('../utils/argv', () => ({
  get argv(): Record<string, unknown> {
    return mockArgv;
  },
}));
jest.mock('../utils/pathes', () => ({
  getCurrentPath: (projectName: string): string => (projectName === '.' ? mockCwd : `${mockCwd}/${projectName}`),
}));

const latestVersionMock = latestVersion as jest.MockedFunction<typeof latestVersion>;
const existsSyncMock = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
const readdirSyncMock = fs.readdirSync as unknown as jest.Mock<string[], [string]>;
const installMock = install as jest.MockedFunction<typeof install>;

const setArgv = (values: Record<string, unknown>): void => {
  Object.assign(mockArgv, { _: [] }, values);
};

describe('rockpack', () => {
  let exitSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    exitSpy = mockProcessExit();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    latestVersionMock.mockResolvedValue(packageJson.version);
    existsSyncMock.mockReturnValue(false);
    installMock.mockResolvedValue();
  });

  afterEach(() => {
    Object.keys(mockArgv).forEach((key) => {
      delete mockArgv[key];
    });
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('exits with code 1 without a project name', async () => {
      setArgv({});

      await expect(rockpack()).rejects.toEqual(new ExitError(1));
      expect(errorSpy).toHaveBeenCalledWith('Please specify the project directory:');
      expect(installMock).not.toHaveBeenCalled();
    });

    it('exits with code 1 when the project directory is not empty', async () => {
      setArgv({ _: ['app'] });
      existsSyncMock.mockReturnValue(true);
      readdirSyncMock.mockReturnValue(['package.json']);

      await expect(rockpack()).rejects.toEqual(new ExitError(1));
      expect(errorSpy).toHaveBeenCalledWith('Project "app" has already created. Please use manual installation:\n');
      expect(installMock).not.toHaveBeenCalled();
    });

    it('does not warn about a prerelease on the registry', async () => {
      setArgv({ _: ['app'] });
      latestVersionMock.mockResolvedValue('99.0.0-next.1');

      await rockpack();

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('does not warn about an older version on the registry', async () => {
      setArgv({ _: ['app'] });
      latestVersionMock.mockResolvedValue('0.0.1');

      await rockpack();

      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('still installs when the registry is unreachable', async () => {
      setArgv({ _: ['app'] });
      latestVersionMock.mockRejectedValue(new Error('getaddrinfo ENOTFOUND registry.npmjs.org'));

      await rockpack();

      expect(warnSpy).not.toHaveBeenCalled();
      expect(installMock).toHaveBeenCalled();
    });

    it('skips the update check in test mode', async () => {
      setArgv({ _: ['app'], mode: 'test' });

      await rockpack();

      expect(latestVersionMock).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it.each([{ v: true }, { version: true }])('prints the version for %p', async (flags) => {
      setArgv(flags);

      await expect(rockpack()).rejects.toEqual(new ExitError(undefined));
      expect(logSpy).toHaveBeenCalledWith(`Rockpack v${packageJson.version}`);
      expect(exitSpy).toHaveBeenCalledWith();
    });

    it.each([{ h: true }, { help: true }])('prints the usage for %p', async (flags) => {
      setArgv(flags);

      await expect(rockpack()).rejects.toEqual(new ExitError(undefined));
      expect(logSpy).toHaveBeenCalledWith('USAGE');
      expect(logSpy).toHaveBeenCalledWith('  rockpack proj');
    });

    it('warns when a newer version is published', async () => {
      setArgv({ _: ['app'] });
      latestVersionMock.mockResolvedValue('99.0.0');

      await rockpack();

      expect(latestVersionMock).toHaveBeenCalledWith('@rockpack/starter');
      expect(warnSpy).toHaveBeenCalledWith('WARNING:   A newer Rockpack version is available!');
      expect(logSpy).toHaveBeenCalledWith(' => The current available version is 99.0.0');
    });

    it('compares versions numerically', async () => {
      setArgv({ _: ['app'] });
      latestVersionMock.mockResolvedValue('100.0.0');

      await rockpack();

      expect(warnSpy).toHaveBeenCalledWith('WARNING:   A newer Rockpack version is available!');
    });

    it('installs into a new project directory', async () => {
      setArgv({ _: ['app'], mode: 'test' });

      await rockpack();

      expect(installMock).toHaveBeenCalledWith({
        args: { testMode: true },
        currentPath: `${mockCwd}/app`,
        projectName: 'app',
      });
    });

    it('installs into an existing empty directory', async () => {
      setArgv({ _: ['app'] });
      existsSyncMock.mockReturnValue(true);
      readdirSyncMock.mockReturnValue([]);

      await rockpack();

      expect(installMock).toHaveBeenCalled();
    });

    it('installs inside --folder', async () => {
      setArgv({ _: ['app'], folder: 'projects' });

      await rockpack();

      expect(installMock).toHaveBeenCalledWith(
        expect.objectContaining({ currentPath: `${mockCwd}/${path.join('projects', 'app')}`, projectName: 'app' }),
      );
    });

    it('names a project in the current git repository after its folder', async () => {
      setArgv({ _: ['.'] });
      existsSyncMock.mockImplementation((file) => file === path.join(mockCwd, '.git'));

      await rockpack();

      expect(installMock).toHaveBeenCalledWith(
        expect.objectContaining({ currentPath: mockCwd, projectName: 'my_project' }),
      );
    });

    it('names a project in the current directory without git "app"', async () => {
      setArgv({ _: ['.'] });

      await rockpack();

      expect(installMock).toHaveBeenCalledWith(expect.objectContaining({ currentPath: mockCwd, projectName: 'app' }));
    });
  });
});
