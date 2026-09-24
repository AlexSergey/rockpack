import type { InternalCompilerConf } from '../types.js';
import type { CompileContext } from './compile-context.js';

import { addArgs } from './args.js';

const ISOMORPHIC_CONTEXT: CompileContext = { configOnly: true, isomorphic: true };
const STANDALONE_CONTEXT: CompileContext = { configOnly: false, isomorphic: false };

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
  });

  describe('negative cases', () => {
    it('leaves the analyzer unset without the flag', () => {
      expect(addArgs(createConf(), STANDALONE_CONTEXT)).not.toHaveProperty('analyzer');
    });

    it('disables the analyzer for an isomorphic backend', () => {
      mockArgv['analyzer'] = true;

      expect(addArgs(createConf({ __isIsomorphicBackend: true }), ISOMORPHIC_CONTEXT).analyzer).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('enables the analyzer with --analyzer', () => {
      mockArgv['analyzer'] = true;

      expect(addArgs(createConf(), STANDALONE_CONTEXT).analyzer).toBe(true);
    });

    it('enables the analyzer for an isomorphic frontend', () => {
      mockArgv['analyzer'] = true;

      expect(addArgs(createConf({ __isIsomorphicFrontend: true }), ISOMORPHIC_CONTEXT).analyzer).toBe(true);
    });
  });
});
