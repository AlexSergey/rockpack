import { defaultDistFile, distExtension, moduleFormats } from './constants.js';

describe('constants', () => {
  describe('negative cases', () => {
    it('supports only cjs and esm module formats', () => {
      expect(Object.keys(moduleFormats)).toEqual(['cjs', 'esm']);
    });
  });

  describe('positive cases', () => {
    it('defines the dist file, extension and module formats', () => {
      expect({ defaultDistFile, distExtension, moduleFormats }).toEqual({
        defaultDistFile: 'index',
        distExtension: '.js',
        moduleFormats: { cjs: 'cjs', esm: 'esm' },
      });
    });
  });
});
