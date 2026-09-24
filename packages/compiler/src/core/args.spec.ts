import type { InternalCompilerConf } from '../types.js';
import type * as ArgsModule from './args.js';

const mockArgv: Record<string, unknown> = {};

jest.mock('yargs', () => jest.fn(() => ({ parseSync: (): Record<string, unknown> => mockArgv })));
jest.mock('yargs/helpers', () => ({ hideBin: (argv: string[]): string[] => argv.slice(2) }));

const loadAddArgs = (): typeof ArgsModule.addArgs => {
  let loaded: typeof ArgsModule.addArgs | undefined;
  jest.isolateModules(() => {
    loaded = jest.requireActual<typeof ArgsModule>('./args.js').addArgs;
  });
  if (!loaded) {
    throw new Error('./args was not loaded');
  }

  return loaded;
};

const createConf = (overrides: Partial<InternalCompilerConf> = {}): InternalCompilerConf => ({
  dist: 'dist/index.js',
  src: 'src/index.ts',
  ...overrides,
});

describe('addArgs', () => {
  afterEach(() => {
    delete mockArgv['analyzer'];
    global.ISOMORPHIC = undefined;
  });

  describe('negative cases', () => {
    it('leaves the analyzer unset without the flag', () => {
      expect(loadAddArgs()(createConf())).not.toHaveProperty('analyzer');
    });

    it('disables the analyzer for an isomorphic backend', () => {
      mockArgv['analyzer'] = true;
      global.ISOMORPHIC = true;

      expect(loadAddArgs()(createConf({ __isIsomorphicBackend: true })).analyzer).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('enables the analyzer with --analyzer', () => {
      mockArgv['analyzer'] = true;

      expect(loadAddArgs()(createConf()).analyzer).toBe(true);
    });

    it('enables the analyzer for an isomorphic frontend', () => {
      mockArgv['analyzer'] = true;
      global.ISOMORPHIC = true;

      expect(loadAddArgs()(createConf({ __isIsomorphicFrontend: true })).analyzer).toBe(true);
    });
  });
});
