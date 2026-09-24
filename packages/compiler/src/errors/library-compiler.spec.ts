import { invalidLibraryOptions, libraryNameMustBeString } from './library-compiler.js';

describe('library compiler errors', () => {
  describe('negative cases', () => {
    it('rejects a non-string library name', () => {
      expect(libraryNameMustBeString()).toMatchObject({
        code: 'INVALID_CONFIG',
        message: "libraryName mus't be a string!",
      });
    });
  });

  describe('positive cases', () => {
    it('describes the expected options shape', () => {
      expect(invalidLibraryOptions().message).toContain('{ name: String, esm?:{ src: String, dist: String }');
    });
  });
});
