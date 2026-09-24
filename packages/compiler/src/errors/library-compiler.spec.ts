import { LIBRARY_OPTS_ERROR, MUST_BE_STRING } from './library-compiler.js';

describe('library compiler errors', () => {
  describe('negative cases', () => {
    it('rejects a non-string library name', () => {
      expect(MUST_BE_STRING).toBe("libraryName mus't be a string!");
    });
  });

  describe('positive cases', () => {
    it('describes the expected options shape', () => {
      expect(LIBRARY_OPTS_ERROR).toContain('{ name: String, esm?:{ src: String, dist: String }');
    });
  });
});
