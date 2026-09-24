import * as utils from './index.js';

describe('@rockpack/utils', () => {
  describe('negative cases', () => {
    it('does not export a default', () => {
      expect(Object.keys(utils)).not.toContain('default');
    });
  });

  describe('positive cases', () => {
    it('exports exactly the public helpers', () => {
      expect(Object.keys(utils).sort()).toEqual([
        'getMajorVersion',
        'getMode',
        'getRootRequireDir',
        'isRecord',
        'isString',
        'packageRoot',
        'readPackageJson',
        'setMode',
      ]);
    });
  });
});
