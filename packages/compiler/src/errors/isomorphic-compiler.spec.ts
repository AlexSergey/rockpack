import {
  BACKEND_IS_REQUIRED,
  SHOULD_SET_MORE_THEN_ONE_COMPILERS,
  SHOULD_SET_OPTION,
  SUPPORT,
} from './isomorphic-compiler.js';

describe('isomorphic compiler errors', () => {
  describe('negative cases', () => {
    it('explains which compilers are missing or unsupported', () => {
      expect([BACKEND_IS_REQUIRED, SUPPORT, SHOULD_SET_MORE_THEN_ONE_COMPILERS]).toEqual([
        'backendCompiler is required to set isomorphicCompiler',
        'isomorphicCompiler supported only frontendCompiler',
        'You should set more then 1 compiler. For example: backendCompiler and frontendCompiler',
      ]);
    });
  });

  describe('positive cases', () => {
    it('names the compiler and the missing option', () => {
      expect(SHOULD_SET_OPTION('frontendCompiler', 'src')).toBe('You should set src option to frontendCompiler');
    });
  });
});
