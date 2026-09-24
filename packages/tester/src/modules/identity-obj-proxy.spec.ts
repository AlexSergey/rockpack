import identityObjProxy from './identity-obj-proxy.js';

describe('identityObjProxy', () => {
  describe('negative cases', () => {
    it('is not treated as an ES module', () => {
      expect(identityObjProxy['__esModule']).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('returns the property name for any class name', () => {
      expect(identityObjProxy['button']).toBe('button');
      expect(identityObjProxy['header-title']).toBe('header-title');
    });
  });
});
