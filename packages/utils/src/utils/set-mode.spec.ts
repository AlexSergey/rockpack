import type { setMode } from './set-mode';

const mockArgv: Record<string, unknown> = {};

jest.mock('yargs', () => jest.fn(() => ({ parseSync: (): Record<string, unknown> => mockArgv })));
jest.mock('yargs/helpers', () => ({ hideBin: (argv: string[]): string[] => argv.slice(2) }));

interface Loaded {
  readonly setMode: typeof setMode;
  readonly yargs: jest.Mock;
}

const load = (): Loaded => {
  let loaded: Loaded | undefined;
  jest.isolateModules(() => {
    loaded = {
      setMode: jest.requireActual<{ setMode: typeof setMode }>('./set-mode').setMode,
      yargs: jest.requireMock<jest.Mock>('yargs'),
    };
  });
  if (!loaded) {
    throw new Error('./set-mode was not loaded');
  }

  return loaded;
};

const modes = ['development', 'production'];
const originalEnv = { BABEL_ENV: process.env.BABEL_ENV, NODE_ENV: process.env.NODE_ENV };

const restoreEnv = (name: keyof typeof originalEnv): void => {
  const value = originalEnv[name];
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
};

describe('setMode', () => {
  beforeEach(() => {
    delete process.env.NODE_ENV;
    delete process.env.BABEL_ENV;
  });

  afterEach(() => {
    delete mockArgv['mode'];
    restoreEnv('NODE_ENV');
    restoreEnv('BABEL_ENV');
  });

  describe('negative cases', () => {
    it('falls back to the default mode when --mode is not an allowed mode', () => {
      mockArgv['mode'] = 'staging';

      expect(load().setMode(modes, 'development')).toBe('development');
      expect(process.env.NODE_ENV).toBe('development');
    });

    it('falls back to NODE_ENV when --mode has no value', () => {
      mockArgv['mode'] = true;
      process.env.NODE_ENV = 'production';

      expect(load().setMode(modes, 'development')).toBe('production');
    });

    it('overwrites a NODE_ENV that is not an allowed mode', () => {
      process.env.NODE_ENV = 'test';

      expect(load().setMode(modes, 'development')).toBe('development');
      expect(process.env.NODE_ENV).toBe('development');
    });
  });

  describe('positive cases', () => {
    it('prefers --mode over NODE_ENV', () => {
      mockArgv['mode'] = 'production';
      process.env.NODE_ENV = 'development';

      expect(load().setMode(modes, 'development')).toBe('production');
    });

    it('uses NODE_ENV when --mode is not set', () => {
      process.env.NODE_ENV = 'production';

      expect(load().setMode(modes, 'development')).toBe('production');
    });

    it('returns the default mode when nothing is set', () => {
      expect(load().setMode(modes, 'production')).toBe('production');
    });

    it('writes the resolved mode to NODE_ENV and BABEL_ENV', () => {
      mockArgv['mode'] = 'production';

      load().setMode(modes, 'development');

      expect(process.env.NODE_ENV).toBe('production');
      expect(process.env.BABEL_ENV).toBe('production');
    });
  });
});
