import { defaultDistFile, distExtension, testFilesIgnore } from './constants.js';

describe('constants', () => {
  describe('negative cases', () => {
    it('keeps specs and fixtures out of the per-file builds', () => {
      expect(testFilesIgnore).toContain('**/__fixtures__/**');
    });
  });

  describe('positive cases', () => {
    it('defines the dist file and extension', () => {
      expect({ defaultDistFile, distExtension }).toEqual({
        defaultDistFile: 'index',
        distExtension: '.js',
      });
    });
  });
});
