import type * as ChildProcess from 'node:child_process';

import type * as OtherModule from './other.js';

const mockArgv: Record<string, unknown> = {};

jest.mock('node:child_process', () => ({ execSync: jest.fn() }));
jest.mock('./argv.js', () => ({
  getArgv: (): Record<string, unknown> => mockArgv,
}));

type Loaded = typeof OtherModule & { readonly execSyncMock: jest.MockedFunction<typeof ChildProcess.execSync> };

// A fresh module per test: the yarn lookup is kept for the whole run.
const loadOther = (): Loaded => {
  let loaded: Loaded | undefined;
  jest.isolateModules(() => {
    const { execSync } = jest.requireMock<typeof ChildProcess>('node:child_process');
    loaded = {
      ...jest.requireActual<typeof OtherModule>('./other.js'),
      execSyncMock: execSync as jest.MockedFunction<typeof ChildProcess.execSync>,
    };
  });
  if (!loaded) {
    throw new Error('./other was not loaded');
  }

  return loaded;
};

const mockYarnMissing = ({ execSyncMock }: Loaded): void => {
  execSyncMock.mockImplementation((command) => {
    if (command === 'yarnpkg --version') {
      throw new Error('yarnpkg: command not found');
    }

    return Buffer.from('11.6.0\n');
  });
};

let warnSpy: jest.SpyInstance;
let errorSpy: jest.SpyInstance;

beforeEach(() => {
  warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  delete mockArgv['yarn'];
  jest.restoreAllMocks();
});

describe('getPM', () => {
  describe('negative cases', () => {
    it('returns npm when the yarn flag is not set', () => {
      const other = loadOther();

      expect(other.getPM()).toBe('npm');
      expect(other.execSyncMock).not.toHaveBeenCalled();
    });

    it.each(['false', 'no', '0', false])('returns npm for --yarn=%p', (value) => {
      mockArgv['yarn'] = value;
      const other = loadOther();

      expect(other.getPM()).toBe('npm');
      expect(other.execSyncMock).not.toHaveBeenCalled();
    });

    it('returns npm when yarn is requested but not installed, with one warning and no stack trace', () => {
      mockArgv['yarn'] = true;
      const other = loadOther();
      mockYarnMissing(other);

      expect([other.getPM(), other.getPM(), other.getPM()]).toEqual(['npm', 'npm', 'npm']);
      expect(other.execSyncMock).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith('Yarn is not installed, npm is used instead.');
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('returns yarn when yarn is requested and installed', () => {
      mockArgv['yarn'] = true;
      const other = loadOther();
      other.execSyncMock.mockReturnValue(Buffer.from('1.22.22'));

      expect(other.getPM()).toBe('yarn');
    });

    it('looks yarn up once for all calls', () => {
      mockArgv['yarn'] = 'yes';
      const other = loadOther();
      other.execSyncMock.mockReturnValue(Buffer.from('1.22.22'));

      expect([other.getPM(), other.getPM(), other.getPM()]).toEqual(['yarn', 'yarn', 'yarn']);
      expect(other.execSyncMock).toHaveBeenCalledTimes(1);
    });
  });
});

describe('getPMVersion', () => {
  describe('negative cases', () => {
    it('reports the npm version when yarn is requested but not installed', () => {
      mockArgv['yarn'] = true;
      const other = loadOther();
      mockYarnMissing(other);

      expect(other.getPMVersion()).toBe('11.6.0\n');
      expect(other.execSyncMock).toHaveBeenLastCalledWith('npm -v');
    });
  });

  describe('positive cases', () => {
    it('reports the raw npm version output', () => {
      const other = loadOther();
      other.execSyncMock.mockReturnValue(Buffer.from('11.6.0\n'));

      expect(other.getPMVersion()).toBe('11.6.0\n');
      expect(other.execSyncMock).toHaveBeenCalledWith('npm -v');
    });

    it('reports the yarn version when yarn is used', () => {
      mockArgv['yarn'] = true;
      const other = loadOther();
      other.execSyncMock.mockReturnValue(Buffer.from('1.22.22\n'));

      expect(other.getPMVersion()).toBe('1.22.22\n');
      expect(other.execSyncMock).toHaveBeenLastCalledWith('yarnpkg --version');
    });
  });
});
