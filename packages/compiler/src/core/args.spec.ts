import type { InternalCompilerConf } from '../types.js';

import { addArgs } from './args.js';

const mockArgv: Record<string, unknown> = {};

jest.mock('./argv.js', () => ({ getArgv: (): Record<string, unknown> => mockArgv }));

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
      expect(addArgs(createConf())).not.toHaveProperty('analyzer');
    });

    it('disables the analyzer for an isomorphic backend', () => {
      mockArgv['analyzer'] = true;
      global.ISOMORPHIC = true;

      expect(addArgs(createConf({ __isIsomorphicBackend: true })).analyzer).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('enables the analyzer with --analyzer', () => {
      mockArgv['analyzer'] = true;

      expect(addArgs(createConf()).analyzer).toBe(true);
    });

    it('enables the analyzer for an isomorphic frontend', () => {
      mockArgv['analyzer'] = true;
      global.ISOMORPHIC = true;

      expect(addArgs(createConf({ __isIsomorphicFrontend: true })).analyzer).toBe(true);
    });
  });
});
