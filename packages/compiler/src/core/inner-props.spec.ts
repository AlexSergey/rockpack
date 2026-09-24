import type { InternalCompilerConf } from '../types.js';

import { innerProps } from './inner-props.js';

const createConf = (overrides: Partial<InternalCompilerConf> = {}): InternalCompilerConf => ({
  dist: 'dist/index.js',
  src: 'src/index.ts',
  ...overrides,
});

describe('innerProps', () => {
  afterEach(() => {
    global.ISOMORPHIC = undefined;
  });

  describe('negative cases', () => {
    it('only resets messages outside isomorphic builds', () => {
      expect(innerProps(createConf({ compilerName: 'backendCompiler' }), 'development')).toEqual(
        createConf({ compilerName: 'backendCompiler', messages: [] }),
      );
    });

    it('leaves an unknown compiler untouched in isomorphic builds', () => {
      global.ISOMORPHIC = true;

      expect(innerProps(createConf({ compilerName: 'libraryCompiler' }), 'development')).toEqual(
        createConf({ compilerName: 'libraryCompiler', messages: [] }),
      );
    });

    it('does not extract frontend styles in isomorphic production builds', () => {
      global.ISOMORPHIC = true;

      expect(
        innerProps(createConf({ compilerName: 'frontendCompiler' }), 'production').__isIsomorphicStyles,
      ).toBeUndefined();
    });
  });

  describe('positive cases', () => {
    it('marks an isomorphic backend', () => {
      global.ISOMORPHIC = true;

      expect(innerProps(createConf({ compilerName: 'backendCompiler' }), 'production')).toMatchObject({
        __isIsomorphic: true,
        __isIsomorphicBackend: true,
        __isIsomorphicStyles: true,
      });
    });

    it('marks an isomorphic frontend and disables html by default', () => {
      global.ISOMORPHIC = true;

      expect(innerProps(createConf({ compilerName: 'frontendCompiler' }), 'development')).toMatchObject({
        __isIsomorphic: true,
        __isIsomorphicFrontend: true,
        __isIsomorphicStyles: true,
        html: false,
      });
    });

    it('keeps an explicit html option of an isomorphic frontend', () => {
      global.ISOMORPHIC = true;

      expect(innerProps(createConf({ compilerName: 'frontendCompiler', html: true }), 'production').html).toBe(true);
    });
  });
});
