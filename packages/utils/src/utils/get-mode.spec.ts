import type { getMode } from './get-mode';

const mockArgv: Record<string, unknown> = {};

jest.mock('yargs', () => jest.fn(() => ({ parseSync: (): Record<string, unknown> => mockArgv })));
jest.mock('yargs/helpers', () => ({ hideBin: (argv: string[]): string[] => argv.slice(2) }));

type Loaded = {
  readonly getMode: typeof getMode;
  readonly yargs: jest.Mock;
};

const load = (): Loaded => {
  let loaded: Loaded | undefined;
  jest.isolateModules(() => {
    loaded = {
      getMode: jest.requireActual<{ getMode: typeof getMode }>('./get-mode').getMode,
      yargs: jest.requireMock<jest.Mock>('yargs'),
    };
  });
  if (!loaded) {
    throw new Error('./get-mode was not loaded');
  }

  return loaded;
};

const originalNodeEnv = process.env.NODE_ENV;

describe('getMode', () => {
  beforeEach(() => {
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    delete mockArgv['mode'];
    process.env.NODE_ENV = originalNodeEnv;
  });

  describe('negative cases', () => {
    it('falls back to the default mode when --mode is not an allowed mode', () => {
      mockArgv['mode'] = 'staging';

      expect(load().getMode()).toBe('development');
    });

    it('falls back to NODE_ENV when --mode has no value', () => {
      mockArgv['mode'] = true;
      process.env.NODE_ENV = 'production';

      expect(load().getMode()).toBe('production');
    });

    it('falls back to the default mode when NODE_ENV is not an allowed mode', () => {
      process.env.NODE_ENV = 'test';

      expect(load().getMode()).toBe('development');
    });
  });

  describe('positive cases', () => {
    it('parses process.argv without the node binary and script path', () => {
      expect(load().yargs).toHaveBeenCalledWith(process.argv.slice(2));
    });

    it('prefers --mode over NODE_ENV', () => {
      mockArgv['mode'] = 'production';
      process.env.NODE_ENV = 'development';

      expect(load().getMode()).toBe('production');
    });

    it('uses NODE_ENV when --mode is not set', () => {
      process.env.NODE_ENV = 'production';

      expect(load().getMode()).toBe('production');
    });

    it('returns the default mode when nothing is set', () => {
      expect(load().getMode()).toBe('development');
    });

    it('accepts custom modes and default mode', () => {
      mockArgv['mode'] = 'staging';

      expect(load().getMode(['staging', 'qa'], 'qa')).toBe('staging');
      expect(load().getMode(['qa'], 'qa')).toBe('qa');
    });
  });
});
