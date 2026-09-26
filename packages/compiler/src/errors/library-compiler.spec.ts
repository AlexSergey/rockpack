import { invalidLibraryOptions } from './library-compiler.js';

describe('library compiler errors', () => {
  describe('negative cases', () => {
    it('reports invalid library options as invalid configuration', () => {
      expect(invalidLibraryOptions().code).toBe('INVALID_CONFIG');
    });
  });

  describe('positive cases', () => {
    it('describes the expected options shape', () => {
      expect(invalidLibraryOptions().message).toContain('{ name: String, esm?:{ src: String, dist: String }');
    });
  });
});
