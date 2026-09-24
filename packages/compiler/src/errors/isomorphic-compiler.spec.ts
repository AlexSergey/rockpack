import {
  backendIsRequired,
  frontendIsRequired,
  moreThanOneCompilerIsRequired,
  optionIsRequired,
} from './isomorphic-compiler.js';

describe('isomorphic compiler errors', () => {
  describe('negative cases', () => {
    it('explains which compilers are missing or unsupported', () => {
      expect(
        [backendIsRequired(), frontendIsRequired(), moreThanOneCompilerIsRequired()].map((e) => e.message),
      ).toEqual([
        'backendCompiler is required to set isomorphicCompiler',
        'isomorphicCompiler supported only frontendCompiler',
        'You should set more then 1 compiler. For example: backendCompiler and frontendCompiler',
      ]);
    });
  });

  describe('positive cases', () => {
    it('reports invalid configuration with the compiler and the missing option', () => {
      expect(optionIsRequired('frontendCompiler', 'src')).toMatchObject({
        code: 'INVALID_CONFIG',
        message: 'You should set src option to frontendCompiler',
      });
    });
  });
});
