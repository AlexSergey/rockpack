import type { InternalCompilerConf } from '../types.js';
import type { CompileContext } from './compile-context.js';

import { innerProps } from './inner-props.js';

const ISOMORPHIC_CONTEXT: CompileContext = { configOnly: true, isomorphic: true };
const STANDALONE_CONTEXT: CompileContext = { configOnly: false, isomorphic: false };

const createConf = (overrides: Partial<InternalCompilerConf> = {}): InternalCompilerConf => ({
  dist: 'dist/index.js',
  src: 'src/index.ts',
  ...overrides,
});

describe('innerProps', () => {
  describe('negative cases', () => {
    it('only resets messages outside isomorphic builds', () => {
      expect(innerProps(createConf({ compilerName: 'backendCompiler' }), 'development', STANDALONE_CONTEXT)).toEqual(
        createConf({ compilerName: 'backendCompiler', messages: [] }),
      );
    });

    it('leaves an unknown compiler untouched in isomorphic builds', () => {
      expect(innerProps(createConf({ compilerName: 'libraryCompiler' }), 'development', ISOMORPHIC_CONTEXT)).toEqual(
        createConf({ compilerName: 'libraryCompiler', messages: [] }),
      );
    });

    it('does not extract frontend styles in isomorphic production builds', () => {
      expect(
        innerProps(createConf({ compilerName: 'frontendCompiler' }), 'production', ISOMORPHIC_CONTEXT)
          .__isIsomorphicStyles,
      ).toBeUndefined();
    });
  });

  describe('positive cases', () => {
    it('marks an isomorphic backend', () => {
      expect(
        innerProps(createConf({ compilerName: 'backendCompiler' }), 'production', ISOMORPHIC_CONTEXT),
      ).toMatchObject({
        __isIsomorphic: true,
        __isIsomorphicBackend: true,
        __isIsomorphicStyles: true,
      });
    });

    it('marks an isomorphic frontend and disables html by default', () => {
      expect(
        innerProps(createConf({ compilerName: 'frontendCompiler' }), 'development', ISOMORPHIC_CONTEXT),
      ).toMatchObject({
        __isIsomorphic: true,
        __isIsomorphicFrontend: true,
        __isIsomorphicStyles: true,
        html: false,
      });
    });

    it('keeps an explicit html option of an isomorphic frontend', () => {
      expect(
        innerProps(createConf({ compilerName: 'frontendCompiler', html: true }), 'production', ISOMORPHIC_CONTEXT).html,
      ).toBe(true);
    });
  });
});
