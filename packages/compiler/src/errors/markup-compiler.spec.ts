import { INVALID_PATH, PATH_CANT_BE_EMPTY } from './markup-compiler.js';

describe('markup compiler errors', () => {
  describe('negative cases', () => {
    it('rejects an empty path', () => {
      expect(PATH_CANT_BE_EMPTY).toBe("Path can't be empty!");
    });
  });

  describe('positive cases', () => {
    it('reports an invalid path', () => {
      expect(INVALID_PATH).toBe('Invalid path');
    });
  });
});
